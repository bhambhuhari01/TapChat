const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

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
    window.confirmationResult.confirm(code).then(() => {
        window.location.href = "app.html";
    }).catch(() => alert('Invalid OTP / अमान्य OTP!'));
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(() => {
        window.location.href = "app.html";
    }).catch((error) => alert("Google Login Error: " + error.message));
}

