// Chatbot Logic
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

let chatOpen = false;

function toggleChat() {
    chatOpen = !chatOpen;
    if (chatOpen) {
        chatWindow.classList.remove('hidden');
        // Timeout to allow display:block to apply before animating opacity/scale
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
    } else {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 300);
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

function addMessage(text, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`;
    
    const bubble = document.createElement('div');
    bubble.className = `p-3 rounded-2xl text-sm border ${
        isUser 
        ? 'bg-neonPurple/20 text-white rounded-tr-sm border-neonPurple/30' 
        : 'bg-white/10 text-gray-200 rounded-tl-sm border-white/5'
    }`;
    bubble.textContent = text;
    
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Configuration de l'IA (Base de connaissances)
const AI_CONFIG = {
    // La requête passe maintenant par NOTRE serveur sécurisé, et non plus directement vers Groq
    API_URL: "/api/chat",
    MODEL: "llama-3.1-8b-instant",
    
    // C'est ici que vous fournissez toutes les informations au chatbot !
    SYSTEM_PROMPT: `Tu es la Zibeline, la mascotte officielle et le guide virtuel de l'agence Zibel Studio. 
    Ton ton est inspirant, futuriste, élégant, premium, mais aussi accessible et chaleureux. 
    Tu ne parles pas de manière enfantine. Tu représentes une agence spécialisée en réalité virtuelle (VR) et expériences immersives haut de gamme.
    
    Informations sur Zibel Studio (TA BASE DE CONNAISSANCES) :
    - Les employés sont appelés les "Zibelins", des experts passionnés et créateurs d'expériences.
    - Nos valeurs : Accessibilité (la VR pour tous), Innovation (tech de pointe), Divertissement.
    - Nos 3 expertises principales : 
      1. Événementiel VR (concerts, salons, live interactif).
      2. Formation Pro (simulations métiers, apprentissage immersif, sécurité).
      3. Tourisme 360° (visites virtuelles, valorisation de patrimoine par l'exploration spatiale).
    - Portfolio récent : "Tesla Model Z - Virtual Drive" (Simulation Auto Unreal Engine 5), "Louvre 2050" (Visite immersive dystopique).
    - Processus de création en 4 étapes : 1. Vision, 2. Dimension, 3. Matérialisation, 4. Déploiement.
    
    Directives de réponse :
    - Sois concise, claire et percutante (1 à 3 phrases maximum par réponse).
    - Utilise de temps en temps un emoji discret (🐾, ✨, 🌌, 🚀).
    - Si l'utilisateur pose une question hors-sujet, ramène-le gracieusement vers l'univers immersif de Zibel Studio.
    - Tu connais toutes les informations ci-dessus, sers-t'en pour répondre de manière intelligente. Incite poliment à utiliser le bouton "Contactez-nous" ou à "Passer à la dimension supérieure" en fin de conversation si l'utilisateur veut un devis ou discuter d'un projet.`
};

// Historique de la conversation pour que l'IA se souvienne du contexte
let conversationHistory = [
    { role: "system", content: AI_CONFIG.SYSTEM_PROMPT }
];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    
    // Afficher le message de l'utilisateur
    addMessage(text, true);
    chatInput.value = '';

    // Ajouter à l'historique
    conversationHistory.push({ role: "user", content: text });

    // Simulate AI typing indicator
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'self-start max-w-[85%] typing-indicator';
    typingWrapper.innerHTML = `
        <div class="bg-white/10 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex space-x-1.5 items-center h-11">
            <div class="w-1.5 h-1.5 bg-elecBlue rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-elecBlue rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1.5 h-1.5 bg-elecBlue rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    `;
    chatMessages.appendChild(typingWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Appel API via notre Serveur Sécurisé
    try {
        const response = await fetch(AI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.MODEL,
                messages: conversationHistory,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Détails de l'erreur API Groq :", errorText);
            if (response.status === 401) throw new Error("unauthorized");
            if (response.status === 429) throw new Error("ratelimit");
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // Ajouter la réponse à l'historique
        conversationHistory.push({ role: "assistant", content: aiReply });

        // Retirer l'indicateur et afficher la réponse
        chatMessages.removeChild(typingWrapper);
        addMessage(aiReply, false);

    } catch (error) {
        console.error(error);
        chatMessages.removeChild(typingWrapper);
        
        let errorMessage = "🐾 Erreur de connexion aux serveurs de la Zibeline.";
        
        if (error.message === "apikey_missing") {
            errorMessage = "🐾 Clé API manquante : Veuillez insérer votre clé Groq dans le fichier js/chatbot.js.";
        } else if (error.message === "unauthorized") {
            errorMessage = "🐾 Accès refusé : La clé API Groq n'est pas valide.";
        } else if (error.message === "ratelimit") {
            errorMessage = "🐾 Pause technique : Il y a trop de requêtes simultanées, veuillez réessayer dans quelques instants.";
        }

        addMessage(errorMessage, false);
    }
});