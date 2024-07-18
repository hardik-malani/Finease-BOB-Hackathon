import React, { useState } from 'react';

const Card = ({ cardDetails = {} }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const defaultCardDetails = {
    number: '**** **** **** ****',
    name: 'CARD HOLDER',
    expiry: 'MM/YY',
    cvc: '***'
  };

  const cardData = { ...defaultCardDetails, ...cardDetails };

  const CardFront = () => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">FINEASE</div>
        <div className="text-xl">VISA</div>
      </div>
      <div className="mb-6">
        <div className="text-xl mb-1">{cardData.number.replace(/(\d{4})/g, '$1 ').trim()}</div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs uppercase mb-1">Card Holder</div>
          <div>{cardData.name}</div>
        </div>
        <div>
          <div className="text-xs uppercase mb-1">Expires</div>
          <div>{cardData.expiry}</div>
        </div>
      </div>
    </div>
  );

  const CardBack = () => (
    <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto">
      <div className="bg-gray-800 h-10 mb-10"></div>
      <div className="flex justify-end mb-4">
        <div className="bg-white text-gray-900 px-2 py-1 rounded">
          <span className="mr-1">CVV</span>
          {cardData.cvc}
        </div>
      </div>
      <div className="text-xs text-center">
        This card is property of Finease. If found, please return to the nearest Finease branch.
      </div>
    </div>
  );

  return (
    <div className="mb-6" onClick={handleCardFlip}>
      <h2 className="text-xl font-semibold mb-4">My Card</h2>
      <div className="relative" style={{ perspective: '1000px', height: '200px' }}>
        <div className="absolute w-full h-full transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className="absolute w-full h-full backface-hidden">
            <CardFront />
          </div>
          <div className="absolute w-full h-full backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <CardBack />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">Click to flip the card</p>
    </div>
  );
};

export default Card;
