let donationCount = 1;

function addDonation() {
  const donationFields = document.getElementById("donationFields");

  const donationDiv = document.createElement("div");
  donationDiv.className = "donation mb-3";
  donationDiv.id = `donation${donationCount}`;

  donationDiv.innerHTML = `
      <h4>Doação ${donationCount}</h4>
      <!-- Update the form to include dynamic field names -->
      <div class="form-group">
          <label for="donationType${donationCount}">Tipo de Doação:</label>
          <select class="form-control" name="donationType${donationCount}" onchange="toggleFields(this)">
              <option value="money" selected>Dinheiro</option>
              <option value="cloth">Vestuário</option>
          </select>
      </div>
      <div class="form-group" id="moneyFields${donationCount}">
          <label for="moneyQuantity${donationCount}">Quantidade:</label>
          <input type="number" class="form-control" name="moneyQuantity${donationCount}" required>
      </div>
      <div class="form-group" id="clothFields${donationCount}" style="display: none;">
          <label for="clothWeight${donationCount}">Peso:</label>
          <input type="number" class="form-control" name="clothWeight${donationCount}" required>
          <label for="clothColor${donationCount}">Cor:</label>
          <input type="text" class="form-control" name="clothColor${donationCount}" required>
          <label for="clothType${donationCount}">Tipo de Vestuário:</label>
          <input type="text" class="form-control" name="clothType${donationCount}" required>
      </div>
      <button type="button" class="btn btn-danger" onclick="removeDonation(${donationCount})">Remover Doação</button>
    `;

  donationFields.appendChild(donationDiv);
  donationCount++;
}

function toggleFields(select) {
  const donationNum = select.parentElement.parentElement.id.replace(
    "donation",
    ""
  );
  const moneyFields = document.getElementById(`moneyFields${donationNum}`);
  const clothFields = document.getElementById(`clothFields${donationNum}`);

  if (select.value === "money") {
    moneyFields.style.display = "block";
    clothFields.style.display = "none";
  } else {
    moneyFields.style.display = "none";
    clothFields.style.display = "block";
  }
}

function submitForm() {
  const form = document.getElementById("donationForm");
  form.submit();
}
function removeDonation(donationNum) {
  const donationDiv = document.getElementById(`donation${donationNum}`);
  donationDiv.remove();
}
