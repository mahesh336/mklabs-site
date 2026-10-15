(() => {
    "use strict";

    const form = document.getElementById("chat-form");
    const input = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("chat-messages");
    const welcomeScreen = document.getElementById("welcome-screen");
    const newChatButton = document.getElementById("new-chat");
    const errorBox = document.getElementById("chat-error");

    if (!form || !input || !messagesContainer || !sendButton) {
        console.error("MKRON AI: Required interface elements are missing.");
        return;
    }

    let conversation = [];
    let isSending = false;

    function showError(message) {
        errorBox.textContent = message;
        errorBox.hidden = false;
    }

    function clearError() {
        errorBox.textContent = "";
        errorBox.hidden = true;
    }

    function addMessage(role, content) {
        const message = document.createElement("div");
        message.className = `chat-message ${role}`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = role === "user" ? "Y" : "✦";

        const body = document.createElement("div");
        body.className = "message-body";

        const label = document.createElement("div");
        label.className = "message-role";
        label.textContent = role === "user" ? "You" : "MKRON AI";

        const text = document.createElement("div");
        text.className = "message-text";
        text.textContent = content;

        body.append(label, text);
        message.append(avatar, body);
        messagesContainer.appendChild(message);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return text;
    }

    function showLoading() {
        return addMessage("assistant", "MKRON AI is thinking...");
    }

    async function sendMessage(rawMessage) {
        const message = rawMessage.trim();

        if (!message || isSending) {
            return;
        }

        clearError();

        if (welcomeScreen) {
            welcomeScreen.remove();
        }

        if (conversation.length >= 20) {
            showError("You've reached the conversation limit. Start a new chat.");
            return;
        }

        isSending = true;
        sendButton.disabled = true;
        input.disabled = true;

        addMessage("user", message);

        const pendingConversation = [
            ...conversation,
            { role: "user", content: message }
        ];

        const loadingMessage = showLoading();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: pendingConversation
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.error || `The AI service returned an error (${response.status}).`
                );
            }

            if (typeof data.reply !== "string" || !data.reply.trim()) {
                throw new Error("MKRON AI returned an empty response.");
            }

            conversation = [
                ...pendingConversation,
                { role: "assistant", content: data.reply }
            ];

            loadingMessage.textContent = data.reply;

        } catch (error) {
            loadingMessage.textContent = "I couldn't generate a response.";

            showError(
                error.message ||
                "Unable to connect to MKRON AI. Please try again."
            );

        } finally {
            isSending = false;
            sendButton.disabled = false;
            input.disabled = false;
            input.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const message = input.value;
        input.value = "";
        input.style.height = "auto";

        sendMessage(message);
    });

    input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
    });

    input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    document.querySelectorAll(".suggestion").forEach(button => {
        button.addEventListener("click", () => {
            const prompt = button.dataset.prompt;

            if (prompt) {
                input.value = prompt;
                sendMessage(prompt);
            }
        });
    });

    newChatButton?.addEventListener("click", () => {
        if (isSending) {
            return;
        }

        conversation = [];
        messagesContainer.replaceChildren();

        const welcome = document.createElement("div");
        welcome.id = "welcome-screen";
        welcome.className = "welcome-screen";

        welcome.innerHTML = `
            <div class="welcome-orb">✦</div>
            <p class="welcome-label">WELCOME TO MKRON</p>
            <h2>What can I help<br>you <span>discover?</span></h2>
            <p class="welcome-description">
                Ask me anything. Let's turn your ideas into something real.
            </p>
            <div class="suggestion-grid">
                <button class="suggestion" data-prompt="Teach me Python from the beginning.">
                    <span>⌘</span>
                    <strong>Learn to code</strong>
                    <small>Start learning Python</small>
                </button>
                <button class="suggestion" data-prompt="Give me an innovative AI project idea for MK LABS.">
                    <span>✧</span>
                    <strong>Explore ideas</strong>
                    <small>Discover new possibilities</small>
                </button>
                <button class="suggestion" data-prompt="Explain how artificial intelligence works in simple terms.">
                    <span>◈</span>
                    <strong>Understand AI</strong>
                    <small>Explore how AI works</small>
                </button>
                <button class="suggestion" data-prompt="Help me debug a JavaScript error.">
                    <span>⌘</span>
                    <strong>Fix some code</strong>
                    <small>Solve a coding problem</small>
                </button>
            </div>
        `;

        messagesContainer.appendChild(welcome);
        clearError();
        input.value = "";
        input.style.height = "auto";

        // Reattach handlers to the newly created suggestion buttons.
        welcome.querySelectorAll(".suggestion").forEach(button => {
            button.addEventListener("click", () => {
                const prompt = button.dataset.prompt;

                if (prompt) {
                    input.value = prompt;
                    sendMessage(prompt);
                }
            });
        });

        input.focus();
    });
})();