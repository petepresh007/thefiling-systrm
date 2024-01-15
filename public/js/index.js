const nav_Button = document.querySelector(".nav-btn");
const link_container = document.querySelector(".link-container");


//navbar
nav_Button.addEventListener("click", nav_button_func);
function nav_button_func() {
    if (link_container.classList.contains("link-container-height")) {
        link_container.classList.remove("link-container-height");

    } else {
        link_container.classList.add("link-container-height");
    }

}


//nav disapear
const links = document.querySelectorAll(".link li");
for (var x = 0; x < links.length; x++) {
    links[x].addEventListener("click", (e) => {
        // e.currentTarget.style.color = "yellow";
        link_container.classList.remove("link-container-height");
    })
}
//nav disapear end

//close button
const clBtn = document.querySelector(".cl-btn");
clBtn.addEventListener("click", function () {
    if (link_container.classList.contains("link-container-height")) {
        link_container.classList.remove("link-container-height");

    } else {
        link_container.classList.add("link-container-height");
    }
})




/**LOGIN FUNCTIONALITY */
const Token = window.localStorage.getItem("adminToken");
const Config = {
    headers: {
        "Authorization": `Bearer ${Token}`
    }
}



window.addEventListener("DOMContentLoaded", async function () {
    footerElemnts()

    listNameFunction()
    try {
        const { data } = await axios.get(`http://localhost:5000/api/admin/stay_loggedin`, Config)
        //console.log(data)
        checkAdmin(data)
        logingout(data)
        welcome(data.username)
    } catch (error) {
        console.log(error)
    }
    timer()
})


function checkAdmin(isAdminLoggedin) {
    const adMinDashboardLink = document.querySelector(".admin-nav");
    adMinDashboardLink.style.display = isAdminLoggedin ? "inline" : "none"
}


/**LOGIN AND LOGOUT FUNCTIONALITY*/
function logingout(isAdminLoggedin) {
    const login = document.querySelector(".login");
    const logout = document.querySelector(".logout");

    if (!isAdminLoggedin) {
        logout.style.display = "none"
        login.style.display = "inline"
    } else {
        logout.style.display = "inline"
        login.style.display = "none"
    }
}

/**Wecome Admin */
function welcome(name) {
    const adminUsername = document.querySelector(".name");
    adminUsername.innerHTML = name
}



function footerElemnts() {
    const div = document.createElement("div");
    const anotherDiv = document.createElement("div");

    div.className = "details";
    anotherDiv.className = "details-two";

    const footerCenter = document.querySelector(".footer-center");
    const footer = document.querySelector(".footer");

    footerCenter.appendChild(div);
    footerCenter.appendChild(anotherDiv);

    const details = document.querySelector(".details");
    const detailsTwo = document.querySelector(".details-two");

    details.innerHTML = `<p>&copy; theFiling system, ${new Date().getFullYear()}, All right reserved`;
    detailsTwo.innerHTML = `
        <p>Peter Precious <i class="fa-brands fa-instagram"></i></p>
        `

    //css
    footer.style.background = "black"
    footer.style.textAlign = "center"
    footer.style.padding = "1rem"
    footer.style.marginTop = "1rem"
}


/**LIST NAMES FUNCTION */
function listNameFunction() {
    const urlParams = new URLSearchParams(window.location.search);

    const dataToSendString = urlParams.get('dataToSend');
    const dataToSendMidtermString = urlParams.get("dataToSendmidterm")
    const dataToSendExaminationString = urlParams.get("dataToSendexamination")

    if (dataToSendString) {
        const dataToSend = JSON.parse(decodeURIComponent(dataToSendString));
        document.querySelector(".test-info").innerHTML = dataToSend[0].test
        const submittedNames = dataToSend.map((data, index) => {
            const { name, subject } = data;
            return `
                <p>${index + 1} ${name} ${subject}</p>
            `
        }).join(" ")
        console.log(submittedNames)
        document.querySelector(".fortnight-names").innerHTML = submittedNames
    } else {
        console.error("No 'dataToSend' parameter found in the query string.");
    }

    if (dataToSendMidtermString) {
        const dataToSendMidterm = JSON.parse(decodeURIComponent(dataToSendMidtermString))
        document.querySelector(".test-info").innerHTML = dataToSendMidterm[0].test
        const subMidterm = dataToSendMidterm.map((data, index) => {
            const { name, subject } = data;
            return `<p>${index + 1} <span>${name}</span> <span>${subject}</span></p>`
        }).join(" ")

        document.querySelector(".fortnight-names").innerHTML = subMidterm
    }

    if (dataToSendExaminationString) {
        const dataToSendExaminaton = JSON.parse(decodeURIComponent(dataToSendExaminationString))
        document.querySelector(".test-info").innerHTML = dataToSendExaminaton[0].test
        const subExam = dataToSendExaminaton.map((data, index) => {
            const { name, subject } = data;
            return `<p>${index + 1} <span>${name}</span> <span>${subject}</span></p>`
        }).join(" ")

        document.querySelector(".fortnight-names").innerHTML = subExam
    }
}

/**TIMER FUNCTION */
function timer() {
    const weekdays = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const portalClosing = document.querySelector(".portal-opening");

    const deadline = document.querySelector(".deadline");
    const items = document.querySelectorAll(".deadline-format h4");


    //let futureDate = new Date(2025, 0, 9, 11, 30, 0);
    let futureDate = null;
    const datetime = document.querySelector(".date-time");
    const inputValue = document.querySelector(".open");


    datetime.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log(inputValue.value)
        }
    })


    
    const year = futureDate.getFullYear();
    const hours = futureDate.getHours();
    const minutes = futureDate.getMinutes();
    const month = months[futureDate.getMonth()];
    const date = futureDate.getDate();
    const weekday = weekdays[futureDate.getDay()];



    /**CLOSES*/
    //portalClosing.textContent = `Submission ends on ${weekday}, ${date} ${month} ${year} ${hours}:${minutes}am`

    //future tine in ms
    const futureTime = futureDate.getTime();

    function getRemainingTime() {
        const today = new Date().getTime();

        //getting the time differnce
        const t = futureTime - today;

        //values in miliseconds
        const oneday = 24 * 60 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;
        const oneMinute = 60 * 1000;

        //calculate days, hrs, minutes left
        let Days = t / oneday;
        Days = Math.floor(Days)

        let Hours = (t % oneday) / oneHour;
        Hours = Math.floor(Hours)

        let Minutes = Math.floor((t % oneHour) / oneMinute);
        let Seconds = Math.floor((t % oneMinute) / 1000);


        //set valus arrays
        const values = [Days, Hours, Minutes, Seconds];

        items.forEach((item, index) => {
            item.innerHTML = format(values[index])
        });


        function format(item) {
            if (item < 10) {
                return item = `0${item}`
            }
            return item;
        }

        if (t < 0) {
            clearInterval(countdown)
            document.querySelector(".upload").style.display = "none";
            deadline.innerHTML = `<h1>The portal for uploading questions has closed...</h1>
                                    <p>Contact the VP Academics</p>
            `
        }
        /**LOGIC GOES HERE */
    }
    //count down
    let countdown = setInterval(getRemainingTime, 1000)

    getRemainingTime()

}