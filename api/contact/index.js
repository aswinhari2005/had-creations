const { getSupabaseAdmin } = require("../_lib/supabase");

function normalizeRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    projectType: row.project_type || "",
    city: row.city || "",
    budgetRange: row.budget_range || "",
    message: row.message,
    createdAt: row.created_at
  };
}

module.exports = async (req, res) => {
  let supabase;

  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server configuration is incomplete."
    });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("enquiries")
      .select("id, name, email, phone, project_type, city, budget_range, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        ok: false,
        message: "Unable to load enquiries."
      });
    }

    return res.status(200).json({
      count: data.length,
      submissions: data.map(normalizeRow)
    });
  }

  if (req.method === "POST") {
    const { name, email, phone, projectType, city, budgetRange, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        message: "Name, email, and project details are required."
      });
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        name,
        email,
        phone: phone || "",
        project_type: projectType || "",
        city: city || "",
        budget_range: budgetRange || "",
        message
      })
      .select("id, name, email, phone, project_type, city, budget_range, message, created_at")
      .single();

    if (error) {
      return res.status(500).json({
        ok: false,
        message: "Unable to save your enquiry right now."
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Thank you. Your request has been received.",
      submission: normalizeRow(data)
    });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({
    ok: false,
    message: "Method not allowed."
  });
};
