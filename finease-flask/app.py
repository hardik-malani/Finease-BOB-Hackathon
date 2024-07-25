from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import requests
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import io
from collections import Counter
import os
from flask import Flask, send_from_directory, jsonify
import re


app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    print('Flask working.')
    return 'Flask working.'

app.config['UPLOAD_FOLDER'] = '/tmp/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

GPT4V_KEY = "<key>"  
GPT4V_ENDPOINT = "https://finease.openai.azure.com/openai/deployments/finease-2/chat/completions?api-version=2024-02-15-preview"

# store transactions
transactions = []
uploaded_files = []


# extract text from PDF
def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# parse transactions
def parse_transactions(text):
    lines = text.split('\n')
    return [line for line in lines if any(keyword in line for keyword in ['UPI/', 'POS/', 'IMPS/', 'NEFT/', 'RTGS/'])]

# Upload PDF and extract transactions
@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    try:
        global transactions
        if 'files' not in request.files:
            return jsonify({'error': 'No files part in the request'}), 400

        files = request.files.getlist('files')
        if not files:
            return jsonify({'error': 'No file selected'}), 400

        transactions = []
        for file in files:
            if file and file.filename.endswith('.pdf'):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                text = extract_text_from_pdf(file_path)
                transactions.extend(parse_transactions(text))

        return jsonify({'transactions': transactions}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Bills
@app.route('/get_transactions', methods=['GET'])
def get_transactions():
    global transactions
    print("Transactions route")
    global transactions
    print("First 10 transactions:", transactions[:10])
    return jsonify(transactions[:10]), 200

# Files uploaded
@app.route('/get_uploaded_files', methods=['GET'])
def get_uploaded_files():
    global transactions
    return jsonify(uploaded_files), 200

def get_income_expenses():
    global transactions
    income = []
    expenses = []
    whitespace_pattern = re.compile(r'\s+')

    for transaction in transactions:
        parts = whitespace_pattern.split(transaction)
        amount = (parts[-2].replace(',', ''))
        print(amount)
        if amount[0] == "-":
            expenses.append(float(amount[1:]))
        else:
            income.append(float(amount[1:]))

    return {'income': income, 'expenses': expenses}

# Finance - expense and income
@app.route('/get_income_expenses', methods=['GET'])
def income_expenses():
    global transactions
    try:
        result = get_income_expenses()
        return jsonify(result), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing transactions"}), 500
    
# Get account balance
@app.route('/get_account_balance', methods=['GET'])
def get_account_balance():
    global transactions
    balances = []
    whitespace_pattern = re.compile(r'\s+')

    for transaction in transactions:
        parts = whitespace_pattern.split(transaction)
        balance = parts[-1].replace(',', '')
        if balance.startswith('-'):
            continue
        balances.append(float(balance))

    return {'balances': balances}

# Finance Summary
@app.route('/get_summary', methods=['GET'])
def get_summary():
    global transactions
    summary = get_income_expenses()
    income = sum(summary["income"]) if summary["income"] else 0
    expenses = sum(summary["expenses"]) if summary["expenses"] else 0
    balance = get_account_balance()
    balances = balance["balances"]
    current_balance = balances[-1] if balances else 0
    initial_balance = balances[0] if len(balances) > 0 else 0
    saving = current_balance - initial_balance

    return jsonify({
        'balance': current_balance,
        'income': income,
        'expenses': expenses,
        'savings': saving
    }), 200

# Model 1: Sustainable transactions
@app.route('/sustainable_transactions', methods=['GET'])
def sustainable_transactions():
    global transactions
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }
    
    transactions_text = "\n".join(transactions)
    payload = {
        "messages": [
            {
                "role": "user",
                "content": f"Based on the following transactions, provide an overall estimated sustainability score from 1 to 100 given the impact those transactions have on the environment, give just the integer score without formatting. In the next line, give a brief reasoning:\n\n{transactions_text}"
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
    except requests.RequestException as e:
        print(f"Failed to categorize transactions. Error: {e}")
        result = "Unable to process transactions."

    score, reasoning = parse_result(result)
    return jsonify({"score": score, "reasoning": reasoning})

def parse_result(result):
    global transactions
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
    global transactions
    if not transactions:
        return jsonify({
            'percentages_text': 'No transactions available.',
            'chart_url': ''
        })
    
    categories = categorize_transactions(transactions)
    category_counts = Counter(categories)
    total_transactions = len(categories)
    percentages = {category: (count / total_transactions) * 100 for category, count in category_counts.items()}

    # Create pie chart
    
    labels = percentages.keys()
    sizes = percentages.values()
    plt.figure(figsize=(10, 7))
    plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')
    plt.title("Transaction Category Distribution")

    # Save chart to a BytesIO object
    img_path = 'static/pie_chart.png'
    plt.savefig(img_path, format='png')
    plt.close()

    # Prepare percentages text
    percentages_text = '\n'.join([f"{category}: {percentage:.1f}%" for category, percentage in percentages.items()])

    return jsonify({
        'percentages_text': percentages_text,
        'chart_url': f'/static/pie_chart.png'
    })

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


def categorize_transaction(transaction):
    global transactions
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    payload = {
        "messages": [
            {
                "role": "user",
                "content": f"Categorize this transaction into one of the categories and just give the category name(Food, Transportation, Entertainment, Healthcare, Utilities, Sent to Friends, Others): {transaction}"
            }
        ],
        "temperature": 0.5,
        "top_p": 1,
        "max_tokens": 60
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        category = response.json()['choices'][0]['message']['content'].strip()
    except requests.RequestException as e:
        print(f"Failed to categorize transaction '{transaction}'. Error: {e}")
        category = "Unknown"
    return category

def categorize_transactions(transactions):
    return [categorize_transaction(transaction) for transaction in transactions[:5]]

# Model 3: Display risk analysis score
@app.route('/risk_analysis', methods=['GET'])
def get_risk_analysis_score():
    global transactions
    headers = {
        "Content-Type": "application/json",
        "api-key": GPT4V_KEY,
    }

    transaction_text = "\n".join(transactions)
    prompt = f"Analyze the risk of the following transactions and provide an estimate risk score between 1 and 100 based on the companies or people the transactions are with (just an estimate number between 1 to 100). Return only the Integer value from 1-100 nothing else:\n{transaction_text}"

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.5,
        "top_p": 1,
        "max_tokens": 60
    }

    try:
        response = requests.post(GPT4V_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        risk_score = int(response.json()['choices'][0]['message']['content'].strip())
    except requests.RequestException as e:
        print(f"Failed to get risk analysis score. Error: {e}")
        risk_score = 0

    return display_risk_analysis_score(risk_score)

def display_risk_analysis_score(risk_score):
    fig, ax = plt.subplots(figsize=(10, 5), subplot_kw={'projection': 'polar'})
    
    # Set the title
    plt.title('Risk Analysis Score', size=20, weight='bold', position=(0.5, 1.1))
    
    # Define the gauge segments
    colors = ['#ff4500', '#ffa500', '#90ee90', '#00ced1']
    labels = ['Poor', 'Average', 'Good', 'Excellent']
    segments = [range(0, 50), range(50, 70), range(70, 85), range(85, 100)]
    
    # Plot the gauge segments
    for i, segment in enumerate(segments):
        ax.bar(
            np.deg2rad(segment),
            [1] * len(segment),
            width=np.deg2rad(1),
            color=colors[i],
            edgecolor='white'
        )
    
    # Plot the needle
    ax.bar(
        np.deg2rad([risk_score]),
        [1],
        width=np.deg2rad(2),
        color='black',
        edgecolor='black'
    )
    
    # Add the labels
    for i, label in enumerate(labels):
        ax.text(
            np.deg2rad(np.mean(segments[i])),
            1.2,
            label,
            horizontalalignment='center',
            size=14,
            weight='bold'
        )
    
    # Configure the chart
    ax.set_yticklabels([])
    ax.set_xticks(np.deg2rad(np.linspace(0, 100, 11)))
    ax.set_xticklabels([str(i) for i in range(0, 101, 10)])
    ax.set_theta_zero_location('N')
    ax.set_theta_direction(-1)

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')



# Model 4: Chatbot interaction
# Initial messages including a placeholder for transactions data
initial_messages = [
    {
        "role": "system",
        "content": "You are an AI assistant that helps people find financial information and provide personalized advice based on their bank statements."
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
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 800
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
        "content": "Here are the transactions I found:\n" + "\n".join(transactions)
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


if __name__ == '__main__':
    app.run()

