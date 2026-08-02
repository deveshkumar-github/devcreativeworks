import { createServerFn } from "@tanstack/react-start";

const ADMIN_PASSWORD = "1234";

function assertAdmin(password: string) {
  if (password !== (process.env.ADMIN_PASSWORD || ADMIN_PASSWORD)) {
    throw new Error("Invalid admin password");
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    return { ok: true, token: "dcw-admin-" + Date.now() };
  });

type Table = "projects" | "services" | "testimonials" | "contacts" | "client_logos" | "payments" | "sessions" | "referrals" | "referrers";

export const adminUpsert = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; table: Table; row: Record<string, unknown> }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: res, error } = await supabaseAdmin
      .from(data.table)
      .upsert(data.row as never)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return res;
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; table: Table; id: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListContacts = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListAllProjects = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListAllServices = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListAllTestimonials = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListAllClientLogos = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("client_logos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListAllPayments = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListSessions = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; payment_id: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("payment_id", data.payment_id)
      .order("scheduled_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminUploadFile = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string; filename: string; contentType: string; dataBase64: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const binary = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase();
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabaseAdmin.storage.from("media").upload(path, binary, {
      contentType: data.contentType || "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("media").getPublicUrl(path);
    return { url: pub.publicUrl, path };
  });
export const adminListReferrers = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("referrers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows;
  });

export const adminListReferrals = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => d)
  .handler(async ({ data }) => {
    assertAdmin(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("referrals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows;
  });
