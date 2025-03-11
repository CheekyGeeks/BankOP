import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FaceIcon from '@mui/icons-material/Face';

const FaceAuthentication = ({ user, onAuthSkip }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const circleRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [authStep, setAuthStep] = useState('initial'); // initial, scanning, captured, verifying, complete, error
  const [authMessage, setAuthMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceOnly, setFaceOnly] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Animation for verification progress
  useEffect(() => {
    let interval;
    if (authStep === 'verifying' && !isProcessing) {
      interval = setInterval(() => {
        setVerificationProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Simulate verification result (success or failure)
            const success = Math.random() > 0.2; // 80% success rate for demo
            if (success) {
              completeAuthentication();
            } else {
              handleVerificationFailed();
            }
            return 100;
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [authStep, isProcessing]);

  // Start webcam when user initiates face verification
  const startWebcam = async () => {
    try {
      setIsProcessing(true);
      setAuthMessage('Accessing camera...');
      setAuthStep('scanning');
      
      // Short delay to ensure the video element is rendered before trying to access it
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started successfully');
              setCameraActive(true);
              setAuthMessage('Position your face within the circle and click Capture.');
              setIsProcessing(false);
            })
            .catch(error => {
              console.error('Error playing video:', error);
              setAuthMessage('Error starting video playback. Please try again.');
              setAuthStep('error');
              setIsProcessing(false);
            });
        };
      } else {
        console.error('Video element not found');
        setAuthMessage('Technical error. Please try again.');
        setAuthStep('error');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setAuthMessage('Unable to access camera. Please check permissions and try again.');
      setAuthStep('error');
      setIsProcessing(false);
    }
  };

  // Detect face in the image and return the face region
  const detectFace = (imageData) => {
    return new Promise((resolve) => {
      // In a real implementation, you would use a face detection library like face-api.js
      // and compare the detected face with the stored face data
      
      const img = new Image();
      img.onload = () => {
        // Create canvas for face-only capture
        const faceCanvas = faceCanvasRef.current;
        const faceContext = faceCanvas.getContext('2d');
        
        // Set face canvas dimensions (circle size)
        faceCanvas.width = 200;
        faceCanvas.height = 200;
        
        // For simulation, assume face is centered in a circular area
        const centerX = img.width / 2;
        const centerY = img.height / 2;
        const radius = Math.min(img.width, img.height) * 0.35;
        
        // Clear the canvas
        faceContext.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        
        // Create circular clipping path
        faceContext.beginPath();
        faceContext.arc(faceCanvas.width/2, faceCanvas.height/2, faceCanvas.width/2, 0, Math.PI * 2, true);
        faceContext.closePath();
        faceContext.clip();
        
        // Draw the center portion of the image (simulating face detection)
        faceContext.drawImage(
          img,
          centerX - radius,
          centerY - radius,
          radius * 2,
          radius * 2,
          0,
          0,
          faceCanvas.width,
          faceCanvas.height
        );
        
        // Get the face-only image data
        const faceOnlyData = faceCanvas.toDataURL('image/png');
        resolve(faceOnlyData);
      };
      
      img.src = imageData;
    });
  };

  // Capture face image
  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current || !faceCanvasRef.current) {
      setAuthMessage('Error capturing image. Please try again.');
      return;
    }

    setIsProcessing(true);
    setAuthMessage('Processing image...');
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get the full image data as a data URL
      const fullImageData = canvas.toDataURL('image/png');
      
      // Store full image for internal use
      setCapturedImage(fullImageData);
      
      // Detect face and get face-only image
      const faceOnlyImage = await detectFace(fullImageData);
      setFaceOnly(faceOnlyImage);
      
      // Move to captured state
      setAuthStep('captured');
      setAuthMessage('Image captured. Verify your image or try again.');
      setIsProcessing(false);
    } catch (error) {
      console.error('Error capturing image:', error);
      setAuthMessage('Failed to capture image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setFaceOnly(null);
    setAuthStep('scanning');
    setAuthMessage('Position your face within the circle and click Capture.');
  };

  // Start verification process
  const startVerification = () => {
    setAuthStep('verifying');
    setVerificationProgress(0);
    setAuthMessage('Verifying your identity...');
  };

  // Handle verification failure
  const handleVerificationFailed = () => {
    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);
    
    if (newAttemptsLeft <= 0) {
      setAuthStep('error');
      setAuthMessage('Maximum verification attempts reached. Please use an alternative login method.');
    } else {
      setAuthStep('error');
      setAuthMessage(`Verification failed. ${newAttemptsLeft} ${newAttemptsLeft === 1 ? 'attempt' : 'attempts'} left.`);
    }
  };

  // Complete authentication
  const completeAuthentication = () => {
    setIsProcessing(true);
    setAuthMessage('Authentication successful! Redirecting to dashboard...');
    
    // Simulate processing delay
    setTimeout(() => {
      // Stop webcam
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setAuthStep('complete');
      setIsProcessing(false);
      
      // Navigate to dashboard after successful authentication
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1000);
  };

  // Handle skipping face authentication
  const handleSkip = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (onAuthSkip) {
      onAuthSkip();
    } else {
      // If no skip handler is provided, navigate directly to dashboard
      navigate('/login'); // Navigate to standard login
    }
  };

  // Compare the captured face with the stored face
  const compareFaces = (capturedFace, storedFace) => {
    // In a real implementation, you would use a face recognition API or library
    // to compare the two face embeddings and calculate a similarity score
    
    // For demo purposes, we're using a random success rate
    return Math.random() > 0.2; // 80% success rate
  };

  // Generate animation keyframes for progress indicator
  const generateProgressStyle = (progress) => {
    return {
      background: `conic-gradient(
        #4169E1 ${progress}%, 
        rgba(65, 105, 225, 0.2) ${progress}%
      )`,
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    };
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        minHeight: 'calc(100vh - 128px)',
        position: 'relative',
        background: 'linear-gradient(135deg, #1a1f36 0%, #121529 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            background: 'rgba(30, 41, 59, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(138, 43, 226, 0.1)',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Initial Face Scan Interface */}
          {authStep === 'initial' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(123, 104, 238, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verify Your Identity
              </Typography>

              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: '2px dashed rgba(123, 104, 238, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 4,
                  background: 'rgba(30, 41, 59, 0.5)',
                }}
              >
                <FaceIcon sx={{ fontSize: 80, color: 'rgba(123, 104, 238, 0.7)' }} />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Welcome back! Please verify your identity using your camera.
                Make sure you're in a well-lit area for best results.
              </Typography>

              <Button
                variant="contained"
                onClick={startWebcam}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #7B68EE 30%, #9370DB 90%)',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
                  width: '100%',
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6A5ACD 30%, #8A2BE2 90%)',
                  }
                }}
              >
                Start Face Verification
              </Button>
              
              <Button
                variant="text"
                onClick={handleSkip}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  '&:hover': {
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                Use Password Instead
              </Button>
            </Box>
          )}

          {/* Scanning View - with camera active */}
          {authStep === 'scanning' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  textAlign: 'center',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(123, 104, 238, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Face Verification
              </Typography>

              {/* Circular container for video */}
              <Box
                sx={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '4px solid #4169E1',
                  backgroundColor: '#121529',
                  mb: 3,
                }}
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover',
                    display: cameraActive ? 'block' : 'none'
                  }}
                />
                
                {!cameraActive && (
                  <CircularProgress size={50} sx={{ color: '#7B68EE', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                )}
                
                {/* Hidden canvases for image processing */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <canvas ref={faceCanvasRef} style={{ display: 'none' }} />
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                {isProcessing ? 'Processing...' : 'Ready to Capture'}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {authMessage}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleSkip}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<CameraAltIcon />}
                  onClick={captureFace}
                  disabled={isProcessing || !cameraActive}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #7B68EE 30%, #9370DB 90%)',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(123, 104, 238, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #6A5ACD 30%, #8A2BE2 90%)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(123, 104, 238, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                >
                  Capture
                </Button>
              </Box>
            </Box>
          )}

          {/* Captured Image View - showing face-only image */}
          {authStep === 'captured' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  textAlign: 'center',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(123, 104, 238, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verify Your Image
              </Typography>

              {/* Display face-only image */}
              <Box
                sx={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '4px solid #4169E1',
                  backgroundColor: '#121529',
                  mb: 3,
                }}
              >
                <img 
                  src={faceOnly} 
                  alt="Captured face"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {authMessage}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={retakePhoto}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    borderColor: 'rgba(123, 104, 238, 0.5)',
                    color: '#7B68EE',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#7B68EE',
                      backgroundColor: 'rgba(123, 104, 238, 0.1)',
                    }
                  }}
                >
                  Retake
                </Button>
                
                <Button
                  variant="contained"
                  onClick={startVerification}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #00A36C 30%, #00C78C 90%)',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0, 163, 108, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #009060 30%, #00B07C 90%)',
                    }
                  }}
                >
                  Verify
                </Button>
              </Box>
            </Box>
          )}

          {/* Verifying View - with progress animation */}
          {authStep === 'verifying' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  textAlign: 'center',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(123, 104, 238, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verifying Identity
              </Typography>

              {/* Circular progress with face-only image */}
              <Box
                ref={circleRef}
                sx={generateProgressStyle(verificationProgress)}
              >
                {/* Inner circular container for face image */}
                <Box
                  sx={{
                    width: '190px',
                    height: '190px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#121529',
                  }}
                >
                  <img 
                    src={faceOnly} 
                    alt="Captured face"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.8,
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mt: 3,
                  mb: 1,
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 500,
                }}
              >
                {isProcessing ? 'Processing...' : `Verifying (${verificationProgress}%)`}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {authMessage}
              </Typography>
            </Box>
          )}

          {/* Success View */}
          {authStep === 'complete' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: '#fff',
                  background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(0, 163, 108, 0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Authentication Successful!
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Redirecting you to dashboard...
              </Typography>

              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(0, 163, 108, 0.15)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 60,
                    color: '#00C78C',
                  }}
                />
              </Box>

              <CircularProgress size={24} sx={{ color: '#7B68EE' }} />
            </Box>
          )}

          {/* Error View */}
          {authStep === 'error' && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ErrorOutlineIcon
                sx={{
                  fontSize: 80,
                  color: '#F44336',
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: '#F44336',
                }}
              >
                Verification Failed
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {authMessage || 'There was an error during verification. Please try again.'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
                {attemptsLeft > 0 ? (
                  <Button
                    variant="contained"
                    onClick={() => setAuthStep('initial')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      background: '#F44336',
                      fontWeight: 500,
                      '&:hover': {
                        background: '#D32F2F',
                      }
                    }}
                  >
                    Try Again
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSkip}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      background: '#4169E1',
                      fontWeight: 500,
                      '&:hover': {
                        background: '#3457C9',
                      }
                    }}
                  >
                    Use Password Instead
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default FaceAuthentication;