export async function verifyDestructiveAction(req, res) {
  const { destructivePassword } = req.body;

  if (destructivePassword === process.env.DESTRUCTIVE_PASSWORD) res.sendStatus(200);
  else res.sendStatus(401);
}
