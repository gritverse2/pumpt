export default function handler(req, res) {
  console.log("🔹 API function called!");
  res.status(200).json({ message: "API is running!" });
}
