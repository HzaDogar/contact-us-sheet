// const scriptURL = 'https://script.google.com/macros/s/AKfycbzCUq95qenCOSVZoE4gvnly9SdE3WFBFMWzAYLpLiNxXQXHWV4QnN8GX8E2BKG7aA2v/exec'

// const form = document.forms['contact-form']

// form.addEventListener('submit', e => {
//   e.preventDefault()
//   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
//   .then(response => alert("Thank you! your form is submitted successfully." ))
//   .then(() => { window.location.reload(); })
//   .catch(error => console.error('Error!', error.message))
// })

const scriptURL = "https://script.google.com/macros/s/AKfycbzCUq95qenCOSVZoE4gvnly9SdE3WFBFMWzAYLpLiNxXQXHWV4QnN8GX8E2BKG7aA2v/exec";

// Function to fetch IP information from ip-api.com
async function fetchIpInfo() {
    try {
        const response = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=1805bd80fbba4810b82b989eb06ceec9");
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Failed to fetch IP information");
        }
    } catch (error) {
        console.error("Error fetching IP information:", error);
        return null;
    }
}

// Event listener for form submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms["contact-form"];
    const submitButton = document.getElementById("submit");
    const loader = document.querySelector(".loader");
    const messageBox = document.querySelector(".message-box");
    const message = document.querySelector(".message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Display loading animation
        submitButton.style.display = "none";
        loader.style.display = "block";

        // Fetch IP information
        const ipInfo = await fetchIpInfo();

        // Populate hidden input fields with IP data
        if (ipInfo) {
            form.querySelector('input[name="ipAddress"]').value = ipInfo.ip;
            form.querySelector('input[name="city"]').value = ipInfo.city;
            form.querySelector('input[name="country"]').value = ipInfo.country_name;
        }

        // Submit the form to the Google Apps Script URL
        fetch(scriptURL, { method: "POST", body: new FormData(form) })
            .then((response) => response.json())
            .then((data) => {
                if (data.result === "success") {
                    // Display thank you message
                    message.textContent = "Thank you for contacting us!";
                    messageBox.style.backgroundColor = "green";
                } else {
                    // Display error message
                    message.textContent = "An error occurred while submitting the form.";
                    messageBox.style.backgroundColor = "red";
                    console.error("Error in Google Sheets submission:", data.error);
                }
            })
            .catch((error) => {
                // Display error message
                message.textContent = "An error occurred while submitting the form.";
                messageBox.style.backgroundColor = "red";
                console.error("Error!", error.message);
            })
            .finally(() => {
                // Hide loading animation
                loader.style.display = "none";
                messageBox.style.display = "block";
            });
    });
});
