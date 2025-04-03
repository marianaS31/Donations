
const mg = require('../mailgunConfig');

exports.sendEmail = (req, res) => {
  const { from, to, subject, text } = req.body;
  const data = { from, to, subject, text };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ error: 'Erro ao enviar e-mail' });
    }
    console.log('E-mail enviado com sucesso:', body);
    res.status(200).json({ message: 'E-mail enviado com sucesso' });
  });
};
