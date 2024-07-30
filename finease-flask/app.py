from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import requests
import numpy as np
import io
from collections import Counter
import os
import re
import time
import json


app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = '/tmp/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

GPT4V_KEY = "32a17b4382f644b48aac5d0ede6f0ac0"
GPT4V_ENDPOINT = "https://finease.openai.azure.com/openai/deployments/finease-2/chat/completions?api-version=2024-02-15-preview"

# Global variables
transactions = []
split_transactions = []
uploaded_files = []
text=""

# to clear data
@app.route('/clear_data', methods=['POST'])
def clear_data():
    global transactions, split_transactions, uploaded_files

    transactions = []
    split_transactions = []
    uploaded_files = []

    upload_folder = app.config['UPLOAD_FOLDER']
    for filename in uploaded_files:
        file_path = os.path.join(upload_folder, filename)
        if os.path.exists(file_path):
            os.remove(file_path)

    return jsonify({'message': 'Data cleared successfully'}), 200

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# Extract format of bank statement
def extract_format():
    global text
    pdf_text = text
    match = re.search(r'.*Date.*', pdf_text, re.MULTILINE)
    return match.group(0) if match else ""

# Parse transactions based on specified keywords
def parse_transactions(text):
    lines = text.split('\n')
    # return [line for line in lines if any(keyword in line for keyword in ['UPI/', 'POS/', 'IMPS/', 'NEFT/', 'RTGS/'])]
    return lines[:200]

# Upload PDF and extract transactions
@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    global transactions, split_transactions, uploaded_files, text
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files part in the request'}), 400

        files = request.files.getlist('files')
        if not files:
            return jsonify({'error': 'No file selected'}), 400

        transactions = []
        split_transactions = []
        uploaded_files = []

        for file in files:
            if file and file.filename.endswith('.pdf'):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                uploaded_files.append(filename)

                text = extract_text_from_pdf(file_path)
                parsed_transactions = parse_transactions(text)
                transactions.extend(parsed_transactions)

            if transactions:
                first_few_transactions = transactions
                split_transactions = get_split_transactions(first_few_transactions)

        return jsonify({'transactions': split_transactions, 'text': text}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_split_transactions(transaction_texts):
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    transactions_text = "\n".join(transaction_texts)
    format = extract_format()

    payload = {
        "messages": [
            {
                "role": "user",
                "content": f"""Return me a python list of dictionaries for each of the transaction, 
                for each transaction the dictionary keys should be Date(STRING), Transaction(STRING), Amount(FLOAT), Balance(FLOAT), \n
                Make amount as negative float if it is withdrawal (JUST GIVE THE LIST, NO EXTRA TEXT):\n\n, 
                The transaction key should display the transaction information; what is the transaction about? \n
                The transaction information is: {transactions_text} \n\n
                DO NOT FABRICATE INFORMATION ON YOUR OWN. \n
                the format of the text is: {format}"""
            }
        ],
        "temperature": 0.2,
        "top_p": 1,
        "max_tokens": 2000
    }

    response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    result = response.json()['choices'][0]['message']['content'].strip()

    # text between '[' and ']'
    match = re.search(r'\[(.*?)\]', result, re.DOTALL)
    if match:
        transactions_text = match.group(0).strip()  
        split_transactions = json.loads(transactions_text)
        return split_transactions
    else:
        raise ValueError("Failed to extract the list from response")

# List of uploaded files
@app.route('/get_uploaded_files', methods=['GET'])
def get_uploaded_files():
    global uploaded_files
    try:
        return jsonify(uploaded_files), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Bills
@app.route('/get_transactions', methods=['GET'])
def get_transactions():
    try:
        if isinstance(split_transactions, list):
            return jsonify({'transactions': split_transactions}), 200
        else:
            return jsonify({'error': 'Invalid data format'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_income_expenses():
    global split_transactions
    income = []
    expenses = []
    for transaction in split_transactions:
        amount_str = transaction['Amount']
        if isinstance(amount_str, str):
            amount_str = amount_str.replace(',', '')
        try:
            amount = float(amount_str)
            if amount < 0:
                expenses.append(amount)
            else:
                income.append(amount)
        except ValueError:
            income = 0
            expenses = 0
            print(f"Warning: Skipping invalid amount value '{amount_str}'")

    return {'income': income, 'expenses': expenses}

# Finance - expense and income
@app.route('/get_income_expenses', methods=['GET'])
def income_expenses():
    try:
        result = get_income_expenses()
        return jsonify(result), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing transactions"}), 500

# Get account balance
@app.route('/get_account_balance', methods=['GET'])
def get_account_balance():
    global split_transactions
    balances = []

    for transaction in split_transactions:
        balance_str = transaction['Balance']

        if isinstance(balance_str, str):
            balance_str = balance_str.replace(',', '')
        
        try:
            balance = float(balance_str)
            balances.append(balance)
        except ValueError:
            balances = 0
            print(f"Warning: Skipping invalid balance value '{balance_str}'")

    return {'balances': balances}

# Finance Summary
@app.route('/get_summary', methods=['GET'])
def get_summary():
    global split_transactions
    summary = get_income_expenses()
    income = sum(summary["income"]) if summary["income"] else 0
    expenses = sum(summary["expenses"]) if summary["expenses"] else 0
    balance_data = get_account_balance()
    balances = balance_data["balances"]
    current_balance = balances[-1] if balances else 0
    initial_balance = balances[0] if balances else 0
    savings = current_balance - initial_balance

    return jsonify({
        'balance': current_balance,
        'income': income,
        'expenses': expenses,
        'savings': savings
    }), 200

# Model 1: Sustainable transactions
@app.route('/sustainable_transactions', methods=['GET'])
def sustainable_transactions():
    global split_transactions
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    transactions_text = "\n".join([f"{t['Date']}, {t['Transaction']}, {t['Amount']}, {t['Balance']}" for t in split_transactions])
    payload = {
        "messages": [
            {
                "role": "user",
                "content": f"""Based on the following transactions, provide an overall estimated sustainability score from 1 to 100 given the impact those transactions have on the environment, give just the integer score without formatting. In the next line, give a brief reasoning:\n\n
                Transaction information: {transactions_text}"""
            }
        ],
        "temperature": 0.3,
        "top_p": 1,
        "max_tokens": 1000
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()['choices'][0]['message']['content'].strip()
    except requests.RequestException as e:
        print(f"Failed to categorize transactions. Error: {e}")
        result = "Unable to process transactions."

    score, reasoning = parse_result(result)
    return jsonify({"score": score, "reasoning": reasoning})

def parse_result(result):
    lines = result.split('\n')
    if len(lines) > 1:
        score = lines[0].strip()
        reasoning = " ".join(lines[1:]).strip()
    else:
        score = "Unknown"
        reasoning = result
    return score, reasoning

# Model 2: Calculate and display percentages
@app.route('/calculate_percentages', methods=['GET'])
def calculate_and_display_percentages():
    if not split_transactions:
        return jsonify({'percentages': []})

    transactions_text = "\n".join([f"{t['Date']}, {t['Transaction']}, {t['Amount']}, {t['Balance']}" for t in split_transactions])
    response = categorize_transactions(transactions_text)
    
    return jsonify({'percentages': response})

def categorize_transactions(transactions_text):
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    prompt = (
        f"""Give me the category and the percentage of spent in that category from the overall bank statement information given below: {transactions_text}
        Categorize into 'Food', 'Entertainment', 'Transportation', 'Utilities', etc. 
        Give me just a python list of dictionaries with category and their percentage.\n\n
        Output format: Python List of Disctionaries - category(string), percentage(float)
        Each category should appear only once"""
    )

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.5,
        "top_p": 1,
        "max_tokens": 2000
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()['choices'][0]['message']['content'].strip()
        match = re.search(r'\[(.*?)\]', result, re.DOTALL)
        if match:
            result = match.group(0).strip()  
            result = json.loads(result)
            
        return result
    except requests.RequestException as e:
        print(f"Failed to categorize transactions. Error: {e}")
        return []

# Model 3: Display risk analysis score
@app.route('/risk_analysis', methods=['GET'])
def get_risk_analysis_score():
    global split_transactions
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    transactions_text = "\n".join([f"{t['Date']}, {t['Transaction']}, {t['Amount']}, {t['Balance']}" for t in split_transactions])
    prompt = f"""Analyze the risk of the following transactions and provide an estimate risk score between 1 and 100 
    based on the companies or people the transactions are with (just an estimate number between 1 to 100). 
    GIVE ONLY A SINGLE INTEGER NUMBER AS OUTPUT:\n{transactions_text} \n"""

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.5,
        "top_p": 1,
        "max_tokens": 1000
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        print("Risk Score: ", response.json()['choices'][0]['message']['content'])
        risk_score = int(response.json()['choices'][0]['message']['content'].strip())
    except requests.RequestException as e:
        print(f"Failed to get risk analysis score. Error: {e}")
        risk_score = 0

    return jsonify({'risk_score': risk_score})


# Model 4: Chatbot interaction
# Initial messages including a placeholder for transactions data
initial_messages = [
    {
        "role": "system",
        "content": """You are an AI assistant that helps people find financial information and provide 
        personalized advice based on their bank statements. Do not give irrelevant information, 
        keep your information focused. Give information only about transactions, not the Bank"""
    },
    {
        "role": "system",
        "content": "If someone asks about BOB or Bank of Baroda related queries, follow this website: https://www.bankofbaroda.in/"
    },
    {
        "role": "assistant",
        "content": "I have extracted your transactions from the uploaded bank statement. How can I assist you today?"
    }
]

def interact_with_chatbot(messages, api_key, endpoint):
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }

    payload = {
        "messages": messages,
        "temperature": 0.2,
        "top_p": 0.95,
        "max_tokens": 100
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Failed to make the request. Error: {e}")
        return None

@app.route('/chatbot', methods=['POST'])
def chatbot():
    global transactions
    user_query = request.json.get("query", "")
    messages = request.json.get("messages", [])

    # Initialize messages if not provided
    if not messages:
        messages = initial_messages.copy()
    
    # Ensure messages are properly formatted
    validated_messages = []
    for msg in messages:
        if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
            validated_messages.append(msg)
    
    # Add the transactions to the conversation
    transactions_message = {
        "role": "assistant",
        "content": "Here are the transactions I found:\n" + "\n".join(transactions) + "Keep the information limited to the transactions, do not utter other information"
    }
    if not any(msg['role'] == 'assistant' and 'transactions' in msg['content'] for msg in validated_messages):
        validated_messages.append(transactions_message)
    
    if user_query.lower() in ['quit', 'exit', 'q']:
        validated_messages.append({"role": "user", "content": user_query})
        validated_messages.append({"role": "assistant", "content": "Session ended."})
        return jsonify({"response": "Session ended.", "messages": validated_messages})

    # Add the user message to the conversation
    user_message = {"role": "user", "content": user_query}
    validated_messages.append(user_message)

    # Call the chatbot API
    response = interact_with_chatbot(validated_messages, GPT4V_KEY, GPT4V_ENDPOINT)
    
    if response is not None:
        assistant_message = response['choices'][0]['message']['content'].strip()
        validated_messages.append({"role": "assistant", "content": assistant_message})
        return jsonify({"response": assistant_message, "messages": validated_messages})
    else:
        error_message = "Sorry, something went wrong."
        validated_messages.append({"role": "assistant", "content": error_message})
        return jsonify({"response": error_message, "messages": validated_messages})

@app.route('/retirement_planning', methods=['POST'])
def retirement_planning():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    balances = "\n".join([f"Balance: {t.get('Balance', 'N/A')}" for t in data.get('split_transactions', [])])
    prompt = f"""
    What are my estimated savings in that year based on the following information:
    Current Age: {data.get('currentAge', 'N/A')}
    Retirement Age: {data.get('retirementAge', 'N/A')}
    Marital Status: {data.get('maritalStatus', 'N/A')}
    Spouse Age: {data.get('spouseAge', 'N/A')}
    Work Income: {data.get('workIncome', 'N/A')}
    Current Saving: {data.get('currentSaving', 'N/A')}
    Recent balances: {balances}

    Provide a list of dictionaries with keys 'date' and 'savings' for the years 2024 to 2066 in 2-year intervals.
    The 'savings' value should represent the estimated cumulative savings at that date.
    Format the output as a JSON array of objects.
    """

    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.5,
        "top_p": 1,
        "max_tokens": 1000
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()['choices'][0]['message']['content'].strip()
        
        # Extract the JSON array from the response
        match = re.search(r'\[.*?\]', result, re.DOTALL)
        if match:
            parsed_result = json.loads(match.group(0))
            return jsonify({"retirementTracking": parsed_result})
        else:
            return jsonify({"error": "Failed to extract JSON from the model's response"}), 500
    except requests.RequestException as e:
        print(f"Failed to get retirement planning. Error: {e}")
        return jsonify({"error": "Failed to get retirement planning"}), 500
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON from the model's response"}), 500

if __name__ == '__main__':
    app.run()


