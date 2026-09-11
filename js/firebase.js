// Firebase Configuration for TapChat
const firebaseConfig = {
    apiKey: "AIzaSyAtK4US0eTXURt2Uutb9GYif_NclzXfhZM",
    authDomain: "tapchat-official.firebaseapp.com",
    projectId: "tapchat-official",
    storageBucket: "tapchat-official.firebasestorage.app",
    messagingSenderId: "664579432894",
    appId: "1:664579432894:web:5e4af6d651b65b693f99ef",
    measurementId: "G-C6C3GJENKN"
};

// Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Recaptcha Verifier setup
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible'
});

function sendOTP() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if(!phoneNumber) {
        alert("Enter phone number / फ़ोन नंबर दर्ज करें");
        return;
    }

    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            document.getElementById('otpBox').style.display = 'block';
            alert('OTP Sent / OTP भेज दिया गया है');
        }).catch((error) => {
            alert("Error: " + error.message);
        });
}

function verifyOTP() {
    const code = document.getElementById('otpCode').value;
    if(!code) {
        alert("Please enter OTP / कृपया OTP दर्ज करें");
        return;
    }
    window.confirmationResult.confirm(code).then(() => {
        window.location.href = "app.html";
    }).catch((error) => alert('Invalid OTP / अमान्य OTP! ' + error.message));
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        window.location.href = "app.html";
    }).catch((error) => alert("Google Login Error: " + error.message));
}

function appleLogin() {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    firebase.auth().signInWithPopup(provider).then((result) => {
        window.location.href = "app.html";
    }).catch((error) => alert("Apple Login Error: " + error.message));
}
