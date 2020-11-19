const email = document.querySelector("#e-mail");
const password = document.querySelector("#password");
const submit_btn = document.querySelector("button");
const error_div = document.querySelector("#errors");

let errors = [];

submit_btn.addEventListener
(
	"click",
	(e) =>
	{
		e.preventDefault();
		
		if(validate())
			sendData();
	}
);


function validate()
{
	if(email.value === "" || password.value === "")
		errors.push("Please enter all fields.");
	if(password.value.length < 6)
		errors.push("The length of the password should be more than 5 characters.");

	if(errors.length > 0)
	{
		displayErrors();
		return false;
	}
	else
		return true;
}

function displayErrors()
{
	for(let i = 0; i < errors.length; i++)
		error_div.innerHTML += `${errors[i]}<br>`;

	errors = [];
}

function sendData()
{
	const form_data = {
		email: email.value,
		password: password.value
	};

	fetch
	(
		"../../server/api/login.php",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			mode: "same-origin",
			body: JSON.stringify(form_data)
		}
	).then
	(
		(res) =>
		{
			if(res.ok)
			{
				return res.json();
			}
			else
			{
				errors.push("Failure in fetching data.");
				displayErrors();

				throw new Error("Failure in fetching data.");
			}
		}
	).then
	(
		(res_data) =>
		{
			if(res_data.code === 200)
			{
				localStorage.setItem("hpsgemstoken", res_data.data.token);
				window.location = "/hps-gems/index.html";
			}
			else
			{
				errors = res_data.errors;
				displayErrors();

				throw new Error(`${res_data.code} ${res_data.status}: ${res_data.errors}`);
			}
		}
	).catch((err) => console.error(err));
}
