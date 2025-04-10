import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import path from "path";
import pool, { query } from "./db.js";
import { checkRole, auth } from "./userRoutes.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const checkDatabaseConnection = async () => {
  try {
    const res = await query("SELECT NOW()");
    console.log("✅ Database connected! Current Time:", res.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

checkDatabaseConnection();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/forms", checkRole("user"), auth, upload.single("file"), async (req, res) => {
  const { name, typeOf, uniqueNumber, user_id } = req.body;
  if (!name || !typeOf || !uniqueNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await query(
      "INSERT INTO forms (name, typeOf, uniqueNumber, filePath, status, takeNumber, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, typeOf, uniqueNumber, req.file ? req.file.path : null, "New", "", user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/forms", checkRole("admin"), auth, async (req, res) => {
  try {
    const result = await query("SELECT * FROM forms");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/forms/user/:userId", checkRole("user"), auth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await query("SELECT * FROM forms WHERE user_id = $1", [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user's forms:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/forms/:id/user", checkRole("user"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  const { name, typeOf, uniqueNumber } = req.body;

  try {
    const result = await query(
      "UPDATE forms SET name=$1, typeOf=$2, uniqueNumber=$3 WHERE id=$4 RETURNING *",
      [name, typeOf, uniqueNumber, formId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/forms/:id/admin", checkRole("admin"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  const { status, takeNumber } = req.body;

  try {
    const result = await query(
      "UPDATE forms SET status=$1, takeNumber=$2 WHERE id=$3 RETURNING *",
      [status, takeNumber, formId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.delete("/forms/:id", checkRole("user"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  try {
    const result = await query("DELETE FROM forms WHERE id=$1 RETURNING *", [formId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/recoveryForms", checkRole("admin"), auth, async (req, res) => {
  const { id, name, typeOf, uniqueNumber, status, takeNumber } = req.body;
  try {
    await query("DELETE FROM forms WHERE id=$1", [id]);
    const result = await query(
      "INSERT INTO recoveryForms (id, name, typeOf, uniqueNumber, status, takeNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, name, typeOf, uniqueNumber, "Not Relevant", takeNumber]
    );
    res.status(201).json({ message: "Form moved to recovery", data: result.rows[0] });
  } catch (error) {
    console.error("Error moving form to recovery:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/recoveryForms", checkRole("admin"), auth, async (req, res) => {
  try {
    const result = await query("SELECT * FROM recoveryForms");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching recovery forms:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/recoveryForms/:id", checkRole("admin"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  try {
    const result = await query("SELECT * FROM recoveryForms WHERE id=$1", [formId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found in recovery" });
    }

    const form = result.rows[0];

    await query("INSERT INTO forms (id, name, typeOf, uniqueNumber, status, takeNumber) VALUES ($1, $2, $3, $4, 'Pending', $5)", [
      form.id, form.name, form.typeOf, form.uniqueNumber, form.takeNumber
    ]);

    await query("DELETE FROM recoveryForms WHERE id=$1", [formId]);

    res.status(200).json({ message: "Form restored", data: form });
  } catch (error) {
    console.error("Error restoring form:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.delete("/recoveryForms/:id", checkRole("admin"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  try {
    const result = await query("DELETE FROM recoveryForms WHERE id=$1 RETURNING *", [formId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting recovery form:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/forms/:id/notRelevant/user", checkRole("user"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  try {
    const result = await query("DELETE FROM forms WHERE id=$1 RETURNING *", [formId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Form marked Not Relevant and deleted" });
  } catch (error) {
    console.error("Error marking as Not Relevant:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/forms/:id/notRelevant/admin", checkRole("admin"), auth, async (req, res) => {
  const formId = Number(req.params.id);
  try {
    const result = await query("SELECT * FROM forms WHERE id=$1", [formId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Form not found" });
    }

    const form = result.rows[0];
    await query("DELETE FROM forms WHERE id=$1", [formId]);

    const insert = await query(
      "INSERT INTO recoveryForms (id, name, typeOf, uniqueNumber, status, takeNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [form.id, form.name, form.typeOf, form.uniqueNumber, "Not Relevant", form.takeNumber]
    );

    res.status(200).json({ message: "Moved to recovery", form: insert.rows[0] });
  } catch (error) {
    console.error("Error moving to recovery:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/forms/king", checkRole("admin"), auth, async (req, res) => {
  try {
    const getKing = await query("SELECT takeNumber, status FROM recoveryForms WHERE status=$1", ["Fixed"]);
    res.status(200).json(getKing.rows);
  } catch (error) {
    console.error("Error fetching king", error);
    res.status(500).json({ message: "Database Error" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
