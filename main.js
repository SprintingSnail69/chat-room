import { createClient } from '/@supabase/supabase-js'

const supabaseUrl = 'https://izafldmmcavastfszrat.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6YWZsZG1tY2F2YXN0ZnN6cmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NTg0MzQsImV4cCI6MjA1NDQzNDQzNH0.GxiftXVf1FpJtUx8G1v6bDD8YxoDTkXGAyJ3bOj-5fQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)


// DOM elements
const usernameInput = document.getElementById("username");
const roomCodeInput = document.getElementById("room-code");
const createRoomBtn = document.getElementById("create-room-btn");
const joinRoomBtn = document.getElementById("join-room-btn");
const chatSection = document.getElementById("chat-section");
const authSection = document.getElementById("auth-section");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const leaveRoomBtn = document.getElementById("leave-room-btn");
const roomTitle = document.getElementById("room-id");

let roomId;
let username;


// Toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 6000);
}

// Show chat section
function showChatSection() {
  authSection.style.display = "none";
  chatSection.style.display = "block";
}

function clearChatBox() {
  chatBox.innerHTML = "";
}

// Listen for new messages in the Firestore database
async function listenForMessages() {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at');

  if (error) {
    console.error("Error fetching messages:", error);
    return;
  }

  messages.forEach(message => {
    const msgEl = document.createElement("p");
    const usernameSpan = document.createElement("span");
    usernameSpan.style.color = "#1f51ff";
    usernameSpan.textContent = message.username;
    usernameSpan.style.fontWeight = "bold";
    const messageText = document.createTextNode(`: ${message.text}`);
    msgEl.appendChild(usernameSpan);
    msgEl.appendChild(messageText);
    chatBox.appendChild(msgEl);
  });

  chatBox.scrollTop = chatBox.scrollHeight;

  supabase
    .from('messages')
    .on('*', async (event) => {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at');
      clearChatBox();
      messages.forEach(message => {
        const msgEl = document.createElement("p");
        const usernameSpan = document.createElement("span");
        usernameSpan.style.color = "#1f51ff";
        usernameSpan.textContent = message.username;
        usernameSpan.style.fontWeight = "bold";
        const messageText = document.createTextNode(`: ${message.text}`);
        msgEl.appendChild(usernameSpan);
        msgEl.appendChild(messageText);
        chatBox.appendChild(msgEl);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .subscribe()
}


// Function to validate username
async function validateUsername(username) {
  if (username.length > 40) {
    showToast("shorten ur username lol");
    return false;
  }
  return true;
}

// Create a new room
createRoomBtn.addEventListener("click", async () => {
  username = usernameInput.value.trim();
  if (!username) return showToast("you forgot your username ._.");

  if (!(await validateUsername(username))) return; // Validate username

  roomId = Math.random().toString(36).substring(2, 8);
  roomTitle.textContent = `${roomId}`;
  showChatSection();
  listenForMessages();
});

// Join an existing room
joinRoomBtn.addEventListener("click", async () => {
  username = usernameInput.value.trim();
  roomId = roomCodeInput.value.trim();

  if (!username || !roomId) return showToast("forgetting something? (room code and/or username)");

  if (!(await validateUsername(username))) return; // Validate username

  roomTitle.textContent = `${roomId}`;
  showChatSection();
  listenForMessages();
});

// Send a message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  let message = messageInput.value.trim();

  if (!message) return;

  // Check if the message is longer than 100 characters
  if (message.length > 300 || message.length < 2) {
    showToast("stop trying to break the chat or spell something out.");
    return;
  }

  // Send message to Supabase
  const { error } = await supabase
    .from('messages')
    .insert([{
      room_id: roomId,
      username: username,
      text: message
    }]);

  if (error) {
    console.error("Error sending message:", error);
    showToast("Error sending message. Please try again.");
  } else {
    messageInput.value = ""; // Clear the input field
  }
}





// Leave the room and reload the page
leaveRoomBtn.addEventListener("click", () => {
  location.reload();
});


const roomCodeElement = document.getElementById("room-id");
roomCodeElement.addEventListener("click", () => {
  const roomCode = roomCodeElement.textContent.trim();
  console.log("Room Code: ", roomCode);
  navigator.clipboard.writeText(roomCode)
    .then(() => showToast("code copied to clipboard :D"))
    .catch((error) => console.error("looks like we couldn't copy that text. \n error:", error));
});

if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
  const textBox = document.getElementById('message-input');
  if (message - input) {
    message - input.focus();
  }
}