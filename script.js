// Get the necessary elements from the HTML
const selectImage = document.getElementById("selectImage");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const memeContainer = document.getElementById("meme-container");
const addTopTextButton = document.querySelector(".toptext-container .add");
const addBottomTextButton = document.querySelector(
  ".bottomtext-container .add"
);
const context = memeContainer.getContext("2d");

// Initialize variables for image and text
let imageLoaded = false;
let image;
let topTextValue = "";
let bottomTextValue = "";

// Event listener for adding top text
addTopTextButton.addEventListener("click", function (event) {
  event.preventDefault();
  topTextValue = topText.value;
  drawMeme();
  topText.value = ""; // Clear the input field
});

// Event listener for adding bottom text
addBottomTextButton.addEventListener("click", function (event) {
  event.preventDefault();
  bottomTextValue = bottomText.value;
  drawMeme();
  bottomText.value = ""; // Clear the input field
});

// Function to draw the meme with image and text
function drawMeme() {
  if (!imageLoaded) {
    alert("Please select an image first.");
    return;
  }

  memeContainer.width = image.width;
  memeContainer.height = image.height;
  context.drawImage(image, 0, 0);

  // Analyze the image color
  const imageData = context.getImageData(
    0,
    0,
    memeContainer.width,
    memeContainer.height
  );
  const colors = imageData.data;

  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  for (let i = 0; i < colors.length; i += 4) {
    totalRed += colors[i];
    totalGreen += colors[i + 1];
    totalBlue += colors[i + 2];
  }

  const averageRed = totalRed / (colors.length / 4);
  const averageGreen = totalGreen / (colors.length / 4);
  const averageBlue = totalBlue / (colors.length / 4);

  // Calculate the brightness of the average color
  const brightness =
    (averageRed * 0.299 + averageGreen * 0.587 + averageBlue * 0.114) / 255;

  // Choose the text color based on the brightness
  const textColor = brightness > 0.5 ? "black" : "white";

  context.fillStyle = textColor;
  context.font = "150px Impact";
  context.textAlign = "center";

  const padding = 150; // Adjust the padding value as desired

  // Draw the previous texts
  drawWrappedText(
    topTextValue,
    memeContainer.width / 2,
    padding + 70,
    memeContainer.width
  );
  drawWrappedText(
    bottomTextValue,
    memeContainer.width / 2,
    memeContainer.height - 20,
    memeContainer.width
  );

  drawWrappedText(
    topText.value,
    memeContainer.width / 2,
    padding + 70,
    memeContainer.width
  );
  drawWrappedText(
    bottomText.value,
    memeContainer.width / 2,
    memeContainer.height - 20,
    memeContainer.width
  );

  const downloadButton = document.getElementById("downloadButton");
  downloadButton.style.display = "inline-block";
}

// Function to handle the download button click event
function downloadMeme() {
  if (!imageLoaded) {
    alert("Please select an image and generate the meme first.");
    return;
  }

  const link = document.createElement("a");
  link.href = memeContainer.toDataURL();
  link.download = "meme.png";
  link.click();
}

// Function to draw wrapped text
function drawWrappedText(text, x, y, maxWidth) {
  const words = text.split(" ");
  const lineHeight = 160; // Adjust the line height as desired
  const textPadding = 10; // Adjust the padding between lines as desired

  //   let fontSize = 50; // Initial font size
  let line = "";
  let currentY = y;

  //   context.font = `${fontSize}px Impact`;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      context.fillText(line, x, currentY);
      line = words[i] + " ";
      currentY += lineHeight + textPadding;
    } else {
      line = testLine;
    }
  }

  // Draw the remaining text if any
  context.fillText(line, x, currentY);
}

// Event listener for selecting an image
selectImage.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    image = new Image();
    image.src = reader.result;

    image.onload = function () {
      imageLoaded = true;
      drawMeme();
    };
  };

  reader.readAsDataURL(file);
});
