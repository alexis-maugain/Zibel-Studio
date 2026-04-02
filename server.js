const express = require('express');
const dotenv = require('dotenv');

// Charge les variables du fichier .env
dotenv.config();

const app = express();

// Permet de lire et d'envoyer du JSON
app.use(express.json());

// Sert les fichiers statiques (index.html, css/, js/)
app.use(express.static('.'));

// Notre point d'accès API (Endpoint backend) qui cache la clé.
// C'est le SEUL endroit où l'appel à Groq est fait en sécurité.
app.post('/api/chat', async (req, res) => {
    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // C'est ici qu'on utilise la clé invisible pour les utilisateurs !
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.text();
            res.status(groqResponse.status).send(errorData);
            return;
        }

        const data = await groqResponse.json();
        res.json(data); // On renvoie la réponse Groq à notre site web en direct
    } catch (error) {
        console.error("Erreur serveur backend:", error);
        res.status(500).json({ error: "Erreur interne de notre serveur." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur prêt: http://localhost:${PORT}`);
    console.log(`Le site Zibel est actuellement protégé. La clé de l'API est cachée !`);
});