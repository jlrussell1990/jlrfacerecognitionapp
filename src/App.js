import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';

const PAT = '658977c82f974581af51a7251e6f3db4';
const USER_ID = 'jlrussell1990';
const APP_ID = 'my-first-application-7kwij';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const initialState = {
      input: '',
      IMAGE_URL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
}}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      IMAGE_URL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      },
      raw: {
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID
        },
        inputs: [
          {
            data: {
              image: {
                url: ''
              }
            }
          }
        ]
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = (data) => {
    const boundingBox = data.outputs[0]?.data?.regions[0]?.region_info?.bounding_box;
    if (boundingBox) {
      console.log("Bounding Box:", boundingBox);
      const image = document.getElementById('inputimage'); // Fix the typo here
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height)
      };
    }
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({
      input: event.target.value,
      raw: {
        ...this.state.raw,
        inputs: [
          {
            data: {
              image: {
                url: event.target.value
              }
            }
          }
        ]
      }
    });
  };

  onButtonSubmit = () => {
  console.log('Button clicked!'); // Add this line
  console.log('Current state:', this.state); // Add this line

  // Rest of your code

    this.setState({ IMAGE_URL: this.state.input });

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Key ${PAT}`
      },
      body: JSON.stringify(this.state.raw)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          fetch('https://jlrfacerecognitionapp-api-ef3d9411ffd4.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
              this.displayFaceBox(this.calculateFaceLocation(data));
            })
            .catch(console.log)
        }
      })
      .catch((error) => console.log('error', error));
  };

  onRouteChange = (route) => {
  console.log('Route changed to:', route); // Add this line
  // Rest of your code

    if (route === 'signout') {
      this.setState({ initialState });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, IMAGE_URL, route, box } = this.state; // Destructure here
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} IMAGE_URL={IMAGE_URL} />
          </div>
        ) : route === 'signin' ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;





// // THIS IS THE START OF THE "FACE DETECTION BOX" VIDEO.
// import React, { Component } from 'react';
// import ParticlesBg from 'particles-bg';
// import Clarifai from 'clarifai';
// import './App.css';
// import Navigation from './Components/Navigation/Navigation';
// import Signin from './Components/Signin/Signin';
// import Register from './Components/Register/Register';
// import Logo from './Components/Logo/Logo';
// import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
// import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
// import Rank from './Components/Rank/Rank';

// const PAT = '658977c82f974581af51a7251e6f3db4';
// const USER_ID = 'jlrussell1990';
// const APP_ID = 'my-first-application-7kwij';
// const MODEL_ID = 'face-detection';
// const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       input: '',
//       IMAGE_URL: '',
//       box: {},
//       route: 'signin',
//       isSignedIn: false,
//       user: {
//         id: '',
//         name: '',
//         email: '',
//         entries: 0,
//         joined: ''
//       },
//       raw: {
//         "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//         },
//         "inputs": [
//           {
//             "data": {
//               "image": {
//                 "url": ''
//               }
//             }
//           }
//         ]
//       }
//     };
//   }

//   loadUser = (data) => {
//     this.setState({user: {
//       id: data.id,
//       name: data.name,
//       email: data.email,
//       entries: data.entries, 
//       joined: data.joined 
//     }});
//   }

// calculateFaceLocation = (data) => {
//   const boundingBox = data.outputs[0]?.data?.regions[0]?.region_info?.bounding_box;
//   if (boundingBox) {
//     console.log("Bounding Box:", boundingBox);
//     const image = document.getElementById('inputimage'); // Fix the typo here
//     const width = Number(image.width);
//     const height = Number(image.height);
//     return {
//       leftCol: boundingBox.left_col * width,
//       topRow: boundingBox.top_row * height,
//       rightCol: width - (boundingBox.right_col * width),
//       bottomRow: height - (boundingBox.bottom_row * height),
//     }
//   }
// }

// displayFaceBox = (box) => {
//   this.setState({box: box});
// }

//   onInputChange = (event) => {
//     this.setState({
//       input: event.target.value,
//       raw: {
//         ...this.state.raw,
//         inputs: [
//           {
//             data: {
//               image: {
//                 url: event.target.value
//               }
//             }
//           }
//         ]
//       }
//     });
//   };

// onButtonSubmit = () => {
//   this.setState({ IMAGE_URL: this.state.input });

//   fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//     },
//     body: JSON.stringify(this.state.raw)
//   })
//     .then(response => response.json())
//     .then(data => {
//       if (data) {
//         fetch('http://localhost:3000/image', { // Removed the space before '/image'
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             id: this.state.user.id
//           })
//         })
//           .then(response => response.json())
//           .then(count => {
//             this.setState(Object.assign(this.state.user, { entries: count}))
//             this.displayFaceBox(this.calculateFaceLocation(data));
//           })
//       }
//     })
//     .catch(error => console.log('error', error));
// }




// onRouteChange = (route) => {
//   if (route === 'signout') {
//     this.setState({isSignedIn: false})
//   } else if (route === 'home') {
//     this.setState({isSignedIn: true})
//   }
//   this.setState({route: route});
// }


//  render() {
//     const { isSignedIn, IMAGE_URL, route, box } = this.state; // Destructure here
//     return (
//       <div className="App">
//         <ParticlesBg type="cobweb" bg={true} />
//         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
//         {route === 'home'
//           ? <div> 
//               <Logo />
//               <Rank />
//               <ImageLinkForm 
//                 onInputChange={this.onInputChange} 
//                 onButtonSubmit={this.onButtonSubmit} 
//               />
//               <FaceRecognition box={box} IMAGE_URL={IMAGE_URL} />
//              </div>
//             :(
//               route === 'signin'
//               ? <Signin onRouteChange={this.onRouteChange}/>
//               : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
//               )
//         }
//       </div>
//     );
//   }
// }

// export default App;