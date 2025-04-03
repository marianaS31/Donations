const mailgun = require('mailgun-js');

const DOMAIN = 'sandboxaceb95645fa9467c8f057a45534cc8d9.mailgun.org'; // Seu domínio do Mailgun
const API_KEY = '3624155056d09fed753db34105f4a39f-51356527-5134c478'; // Sua chave de API do Mailgun

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

module.exports = mg;
