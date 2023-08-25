

// // THIS IS AFTER THE PERSON ANSWERED IN DISCORD AND I USED CHAT GPT. THIS WORKS TO THE END OF THE "CODING YOUR IMAGE RECOGNITION API VIDEO"

import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({IMAGE_URL, box}) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
			<img id='inputimage' alt='' src={IMAGE_URL} width='500px' height='auto' />
			<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}} ></div>
			</div>
		</div>	
	);
}

export default FaceRecognition; 