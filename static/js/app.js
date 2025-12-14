document.addEventListener("DOMContentLoaded", () => {

    const chatWindow = document.getElementById("chatWindow");
    const userInput = document.getElementById("userInput");
    const botNameEl = document.getElementById("botName");
    const botRoleEl = document.getElementById("botRole");

    let currentPersona = "beep42";

    const personaMeta = {
        beep42: { name: "BEEP-42", role: "Robotic Assistant" },
        executive_ai: { name: "Executive AI", role: "Business Advisor" },
        socrates: { name: "Socrates", role: "Socratic Tutor" }
    };

    document.querySelectorAll(".persona-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".persona-card")
                .forEach(c => c.classList.remove("active"));

            card.classList.add("active");

            currentPersona = card.dataset.persona;

            console.log("Persona switched to:", currentPersona);

            botNameEl.innerText = personaMeta[currentPersona].name;
            botRoleEl.innerText = personaMeta[currentPersona].role;

            chatWindow.innerHTML = "";
        });
    });

    window.sendMessage = async function () {
        const text = userInput.value.trim();
        if (!text) return;

        userInput.value = "";
        appendMessage("user", text);

        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                persona_id: currentPersona,
                message: text
            })
        });

        const data = await res.json();
        appendMessage("bot", data.reply);
    };

    function appendMessage(role, text) {
        const msg = document.createElement("div");
        msg.className = `message ${role}`;

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerText = text;

        msg.appendChild(bubble);
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
