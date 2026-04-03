const XLSX = require("xlsx");
const { getSupabaseAdmin } = require("../_lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      message: "Method not allowed."
    });
  }

  let supabase;

  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server configuration is incomplete."
    });
  }

  const { data, error } = await supabase
    .from("enquiries")
    .select("id, name, email, phone, project_type, city, budget_range, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      ok: false,
      message: "Unable to export enquiries right now."
    });
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((entry) => ({
      ID: entry.id,
      Name: entry.name,
      Email: entry.email,
      Phone: entry.phone || "",
      "Project Type": entry.project_type || "",
      City: entry.city || "",
      "Budget Range": entry.budget_range || "",
      Message: entry.message,
      "Created At": entry.created_at
    }))
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="had-creations-enquiries.xlsx"'
  );

  return res.status(200).send(buffer);
};
