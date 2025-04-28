let previousTotal = 0;

// Function to get customer information
function getCustomerInfo() {
  return {
    firstName: document.getElementById('customerFirstName').value || '',
    lastName: document.getElementById('customerLastName').value || '',
    address: document.getElementById('customerStreet').value || '',
    city: document.getElementById('customerCity').value || '',
    state: document.getElementById('customerState').value || '',
    zip: document.getElementById('customerZip').value || '',
    email: document.getElementById('customerEmail').value || '',
    phone: document.getElementById('customerPhone').value || ''
  };
}

// Function to update price labels dynamically based on inputs
function updatePriceLabels() {
  const pricePerPane = parseFloat(document.getElementById('pricePerPane').value);
  const pricePerFrenchPane = parseFloat(document.getElementById('pricePerFrenchPane').value);
  const pricePerScreen = parseFloat(document.getElementById('pricePerScreen').value);
  const pricePerTrack = parseFloat(document.getElementById('pricePerTrack').value);
  const cleanType = document.getElementById('cleanType').value;

  let cleanMultiplier = cleanType === 'both' ? 1.3333 : 1;

  document.getElementById('singlePanePriceLabel').textContent = `$${(pricePerPane * cleanMultiplier).toFixed(2)} each`;
  document.getElementById('doublePanePriceLabel').textContent = `$${(pricePerPane * 2 * cleanMultiplier).toFixed(2)} each`;
  document.getElementById('frenchPanePriceLabel').textContent = `$${(pricePerFrenchPane * cleanMultiplier).toFixed(2)} per small pane`;

  const secondFloorAdjustmentType = document.getElementById('secondFloorAdjustmentType').value;
  const adjustmentValue = parseFloat(document.getElementById('secondFloorAdjustmentValue').value);
  const secondFloorFrenchPanesPerWindow = parseInt(document.getElementById('secondFloorFrenchPanesPerWindow').value) || 0;

  if (secondFloorAdjustmentType === 'fixed') {
    document.getElementById('secondFloorSinglePanePriceLabel').textContent = `$${(pricePerPane * cleanMultiplier + adjustmentValue).toFixed(2)} each`;
    document.getElementById('secondFloorDoublePanePriceLabel').textContent = `$${(pricePerPane * 2 * cleanMultiplier + adjustmentValue).toFixed(2)} each`;
    document.getElementById('secondFloorFrenchPanePriceLabel').textContent = `$${((secondFloorFrenchPanesPerWindow * pricePerFrenchPane * cleanMultiplier) + adjustmentValue).toFixed(2)} total per window`;
  } else {
    document.getElementById('secondFloorSinglePanePriceLabel').textContent = `$${(pricePerPane * cleanMultiplier * (1 + adjustmentValue / 100)).toFixed(2)} each`;
    document.getElementById('secondFloorDoublePanePriceLabel').textContent = `$${(pricePerPane * 2 * cleanMultiplier * (1 + adjustmentValue / 100)).toFixed(2)} each`;
    document.getElementById('secondFloorFrenchPanePriceLabel').textContent = `$${(secondFloorFrenchPanesPerWindow * pricePerFrenchPane * cleanMultiplier * (1 + adjustmentValue / 100)).toFixed(2)} total per window`;
  }

  document.getElementById('screenPriceLabel').textContent = `$${pricePerScreen.toFixed(2)} each`;
  document.getElementById('trackPriceLabel').textContent = `$${pricePerTrack.toFixed(2)} each`;
}

// Function to calculate the quote dynamically
function calculateQuote() {
  updatePriceLabels();

  const pricePerPane = parseFloat(document.getElementById('pricePerPane').value);
  const pricePerFrenchPane = parseFloat(document.getElementById('pricePerFrenchPane').value);
  const pricePerScreen = parseFloat(document.getElementById('pricePerScreen').value);
  const pricePerTrack = parseFloat(document.getElementById('pricePerTrack').value);

  const firstFloorSinglePanes = parseInt(document.getElementById('firstFloorSinglePanes').value) || 0;
  const firstFloorDoublePanes = parseInt(document.getElementById('firstFloorDoublePanes').value) || 0;
  const firstFloorFrenchPanes = parseInt(document.getElementById('firstFloorFrenchPanes').value) || 0;

  const secondFloorSinglePanes = parseInt(document.getElementById('secondFloorSinglePanes').value) || 0;
  const secondFloorDoublePanes = parseInt(document.getElementById('secondFloorDoublePanes').value) || 0;
  const secondFloorFrenchPanes = parseInt(document.getElementById('secondFloorFrenchPanes').value) || 0;

  const totalScreens = parseInt(document.getElementById('totalScreens').value) || 0;
  const totalTracks = parseInt(document.getElementById('totalTracks').value) || 0;

  const cleanType = document.getElementById('cleanType').value;
  let cleanMultiplier = cleanType === 'both' ? 1.3333 : 1;

  const adjustedPanePrice = +(pricePerPane * cleanMultiplier).toFixed(2);
  const adjustedFrenchPrice = +(pricePerFrenchPane * cleanMultiplier).toFixed(2);

  // Calculations for each service (if the service has a non-zero value)
  const firstFloorSinglePaneTotal = firstFloorSinglePanes * adjustedPanePrice;
  const firstFloorDoublePaneTotal = firstFloorDoublePanes * adjustedPanePrice * 2;
  const firstFloorFrenchPaneTotal = firstFloorFrenchPanes * adjustedFrenchPrice;

  const secondFloorSinglePaneTotal = secondFloorSinglePanes * adjustedPanePrice;
  const secondFloorDoublePaneTotal = secondFloorDoublePanes * adjustedPanePrice * 2;
  const secondFloorFrenchPaneTotal = secondFloorFrenchPanes * adjustedFrenchPrice;

  const screenTotal = totalScreens * pricePerScreen;
  const trackTotal = totalTracks * pricePerTrack;

  const subtotal = firstFloorSinglePaneTotal + firstFloorDoublePaneTotal + firstFloorFrenchPaneTotal + 
                   secondFloorSinglePaneTotal + secondFloorDoublePaneTotal + secondFloorFrenchPaneTotal + 
                   screenTotal + trackTotal;

  const discountType = document.getElementById('discountType').value;
  const discountValue = parseFloat(document.getElementById('discountValue').value) || 0;

  let discountApplied = 0;
  let finalTotal = subtotal;

  if (discountType === 'amount') {
    discountApplied = Math.min(discountValue, subtotal);
    finalTotal = subtotal - discountApplied;
  } else if (discountType === 'percent') {
    discountApplied = Math.min((subtotal * discountValue / 100), subtotal);
    finalTotal = subtotal - discountApplied;
  }

  let finalTotalHeading = discountApplied > 0 ? "Grand Total After Discount" : "Grand Total";

  let quoteHtml = `
    <h2>Quote Summary</h2>
    <h3>First Floor:</h3>
  `;

  // Conditionally include each service
  if (firstFloorSinglePanes > 0) quoteHtml += `<p>Single Pane Windows: $${firstFloorSinglePaneTotal.toFixed(2)}</p>`;
  if (firstFloorDoublePanes > 0) quoteHtml += `<p>Double Pane Windows: $${firstFloorDoublePaneTotal.toFixed(2)}</p>`;
  if (firstFloorFrenchPanes > 0) quoteHtml += `<p>French Windows: $${firstFloorFrenchPaneTotal.toFixed(2)}</p>`;

  quoteHtml += `<h3>Second Floor and Above:</h3>`;

  if (secondFloorSinglePanes > 0) quoteHtml += `<p>Single Pane Windows: $${secondFloorSinglePaneTotal.toFixed(2)}</p>`;
  if (secondFloorDoublePanes > 0) quoteHtml += `<p>Double Pane Windows: $${secondFloorDoublePaneTotal.toFixed(2)}</p>`;
  if (secondFloorFrenchPanes > 0) quoteHtml += `<p>French Windows: $${secondFloorFrenchPaneTotal.toFixed(2)}</p>`;

  if (screenTotal > 0) quoteHtml += `<h3>Screens:</h3><p>Screens Total: $${screenTotal.toFixed(2)}</p>`;
  if (trackTotal > 0) quoteHtml += `<h3>Tracks:</h3><p>Tracks Total: $${trackTotal.toFixed(2)}</p>`;

  quoteHtml += `<h3>Subtotal:</h3><p>Subtotal: $${subtotal.toFixed(2)}</p>`;

  if (discountApplied > 0) {
    quoteHtml += `
      <h3>Discount:</h3>
      <p>Discount Applied: -$${discountApplied.toFixed(2)}</p>
    `;
  }

  quoteHtml += `
    <h2><strong>${finalTotalHeading}: $<span id="grandTotalNumber">${finalTotal.toFixed(2)}</span></strong></h2>
  `;

  document.getElementById('results').innerHTML = quoteHtml;
  animateGrandTotal(finalTotal);
}


// Animation for Grand Total
function animateGrandTotal(finalTotal) {
  const grandTotalElement = document.getElementById('grandTotalNumber');
  if (!grandTotalElement) return;

  const duration = 400;
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;
  const start = previousTotal;
  const end = finalTotal;

  grandTotalElement.classList.remove('flash');
  void grandTotalElement.offsetWidth;
  grandTotalElement.classList.add('flash');

  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const current = start + (end - start) * progress;

    grandTotalElement.textContent = current.toFixed(2);

    if (frame === totalFrames) {
      clearInterval(counter);
      grandTotalElement.textContent = end.toFixed(2);
      previousTotal = end;
    }
  }, 1000 / frameRate);
}

// Function to print the quote
function printQuote() {
  const simpleQuote = generateSimpleQuote();
  const customer = getCustomerInfo();

  // Start with the email body template
  let emailBody = `Below is the quote for ${customer.firstName} ${customer.lastName}\n\n`;
  
  emailBody += `Name: ${customer.firstName} ${customer.lastName}\n`;
  emailBody += `Phone: ${customer.phone}\n`;
  emailBody += `Email: ${customer.email}\n`;
  emailBody += `Address: ${customer.address}\n${customer.city}, ${customer.state} ${customer.zip}`;
  
  // Services included based on user selection
  emailBody += `Services Included:\n\n`;

  // Check and include the selected services
  if (document.getElementById('cleanType').value === 'interior' || document.getElementById('cleanType').value === 'both') {
    emailBody += `- Interior window cleaning\n`;
  }

  if (document.getElementById('cleanType').value === 'exterior' || document.getElementById('cleanType').value === 'both') {
    emailBody += `- Exterior window cleaning\n`;
  }

  // Check if screen cleaning is selected
  const totalScreens = parseInt(document.getElementById('totalScreens').value) || 0;
  if (totalScreens > 0) {
    emailBody += `- Screen cleaning\n`;
  }

  // Check if track cleaning is selected
  const totalTracks = parseInt(document.getElementById('totalTracks').value) || 0;
  if (totalTracks > 0) {
    emailBody += `- Track cleaning\n`;
  }

  // Add the subtotal, discount, and total
  emailBody += `\n${simpleQuote}\n\n`;

  // Add the call to action for scheduling
  emailBody += `Quote valid for 30 days from the date of this email.`;

  const today = new Date();
  const currentDate = today.toLocaleDateString();
  const subject = encodeURIComponent(`Quote: ${currentDate} ${customer.firstName} ${customer.lastName}`);
  const body = encodeURIComponent(emailBody);

  // Use the customer's email in the "To" field
  window.location.href = `mailto:${'alex@squeegeeexpress.com'}?subject=${subject}&body=${body}`;
}

// Function to email the quote with the specified template
function emailQuote() {
  const simpleQuote = generateSimpleQuote();
  const customer = getCustomerInfo();

  // Start with the email body template
  let emailBody = `Hi ${customer.firstName} ${customer.lastName},\n\n`;
  emailBody += 'Thank you for considering Squeegee Express Window Cleaning.\n';
  emailBody += 'Below is your personalized quote:\n\n';

  // Services included based on user selection
  emailBody += `Services Included:\n\n`;

  // Check and include the selected services
  if (document.getElementById('cleanType').value === 'interior' || document.getElementById('cleanType').value === 'both') {
    emailBody += `- Interior window cleaning\n`;
  }

  if (document.getElementById('cleanType').value === 'exterior' || document.getElementById('cleanType').value === 'both') {
    emailBody += `- Exterior window cleaning\n`;
  }

  // Check if screen cleaning is selected
  const totalScreens = parseInt(document.getElementById('totalScreens').value) || 0;
  if (totalScreens > 0) {
    emailBody += `- Screen cleaning\n`;
  }

  // Check if track cleaning is selected
  const totalTracks = parseInt(document.getElementById('totalTracks').value) || 0;
  if (totalTracks > 0) {
    emailBody += `- Track cleaning\n`;
  }

  // Add the subtotal, discount, and total
  emailBody += `\n${simpleQuote}\n\n`;

  // Add the call to action for scheduling
  emailBody += `Ready to schedule?\n`;
  emailBody += `Simply reply to this email or call us at (404) 500-9479. We'll find a time that's convenient for you.\n\n`;

  emailBody += `Thank you again for the opportunity to earn your business.\n`;
  emailBody += `We look forward to helping your home shine.\n\n`;

  emailBody += `Best regards,\n`;
  emailBody += `Alexander Mooney\n`;
  emailBody += `Owner, Squeegee Express Window Cleaning\n`;
  emailBody += `Phone: (404) 500-9479\n`;
  emailBody += `Website: www.SqueegeeExpress.com\n\n`;

  // Include the business address
  emailBody += `Our Address: 3070 N Main St, Kennesaw, GA 30144\n\n`;

  emailBody += `Quote valid for 30 days from the date of this email.`;

  const recipientEmail = customer.email || ''; // Get the email from the customer information
  const subject = encodeURIComponent('Window Cleaning Quote from Squeegee Express');
  const body = encodeURIComponent(emailBody);

  // Use the customer's email in the "To" field
  window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}


// Generate a simple quote string
function generateSimpleQuote() {
  const results = document.getElementById('results').innerText;
  const lines = results.split('\n');
  
  let windowsTotal = 0, screensTotal = 0, tracksTotal = 0, subtotal = 0, discount = 0, finalTotal = 0;
  let quoteSummary = '';

  // Track if window services are included
  let windowsIncluded = false;

  lines.forEach(line => {
    // Group Single Pane and Double Pane Windows as "Windows"
    if (line.includes('Single Pane Windows') || line.includes('Double Pane Windows') || line.includes('French Windows')) {
      const amount = parseFloat(line.split('$')[1]);
      if (amount > 0) {
        windowsTotal += amount;
        windowsIncluded = true; // Flag that windows services are included
      }
    } 
    // Include screens if there's a value greater than 0
    else if (line.includes('Screens Total')) {
      screensTotal = parseFloat(line.split('$')[1]);
    } 
    // Include tracks if there's a value greater than 0
    else if (line.includes('Tracks Total')) {
      tracksTotal = parseFloat(line.split('$')[1]);
    } 
    // Extract subtotal, discount, and final total
    else if (line.includes('Subtotal:')) {
      subtotal = parseFloat(line.split('$')[1]);
    } 
    else if (line.includes('Discount Applied:')) {
      discount = parseFloat(line.split('$')[1]);
    } 
    else if (line.includes('Grand Total')) {
      finalTotal = parseFloat(line.split('$')[1]);
    }
  });

  // Only include "Windows" line if there are windows included
  if (windowsIncluded) {
    quoteSummary += `Windows: $${windowsTotal.toFixed(2)}\n`;
  }

  // Only include screens if greater than 0
  if (screensTotal > 0) {
    quoteSummary += `Screens: $${screensTotal.toFixed(2)}\n`;
  }

  // Only include tracks if greater than 0
  if (tracksTotal > 0) {
    quoteSummary += `Tracks: $${tracksTotal.toFixed(2)}\n`;
  }

  // Include subtotal
  quoteSummary += `Subtotal: $${subtotal.toFixed(2)}\n`;

  // Only include discount if greater than 0
  if (discount > 0) {
    quoteSummary += `Discount: -$${discount.toFixed(2)}\n`;
  }

  // Final total
  quoteSummary += `Total: $${finalTotal.toFixed(2)}`;

  return `Window Cleaning Quote Summary:\n\n${quoteSummary}`;
}

// Event listener to ensure inputs are updated
document.querySelectorAll('input, select').forEach(input => {
  input.addEventListener('input', event => {
    if (input.type === 'number' && parseFloat(input.value) < 0) {
      input.value = 0;
    }
    calculateQuote();
  });
});

calculateQuote();
