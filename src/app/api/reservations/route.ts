import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log("API: Début du traitement de la requête POST");
    
    const body = await request.json()
    console.log("API: Données reçues:", body);
    console.log("API: Format des dates - check_in:", body.check_in, "check_out:", body.check_out);
    
    const { name, email, phone, check_in, check_out, guests, message, plan_name, price, period } = body
    
    // Validation des données
    if (!name || !email || !phone || !check_in || !check_out || !guests || !plan_name) {
      console.log("API: Validation échouée - champs manquants");
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }
    
    // S'assurer que les dates sont au bon format (YYYY-MM-DD)
    const formattedCheckIn = typeof check_in === 'string' ? check_in : new Date(check_in).toISOString().split('T')[0];
    const formattedCheckOut = typeof check_out === 'string' ? check_out : new Date(check_out).toISOString().split('T')[0];
    
    console.log("API: Dates formatées - check_in:", formattedCheckIn, "check_out:", formattedCheckOut);
    
    try {
      // Utilisation directe des valeurs de Supabase (solution temporaire)
      const supabaseUrl = "https://qvwrtqwygauirugoafry.supabase.co";
      const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2d3J0cXd5Z2F1aXJ1Z29hZnJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDc4MzI5NywiZXhwIjoyMDU2MzU5Mjk3fQ.Tn_Mw-9KTbgpXTGgJxekAd0-fGS4RN9pIkblj8XN9Eo";
      
      console.log("API: Tentative de création du client Supabase avec URL:", supabaseUrl);
      
      // Création du client Supabase avec la clé de service (bypass RLS)
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Préparation des données pour l'insertion
      const reservationData = {
        name,
        email,
        phone,
        check_in: formattedCheckIn,
        check_out: formattedCheckOut,
        guests,
        message,
        plan_name,
        price,
        period,
        status: "pending"
      };
      
      console.log("API: Tentative d'insertion dans Supabase:", reservationData);
      
      // Insertion dans la base de données
      const { data, error } = await supabase
        .from("reservations")
        .insert(reservationData)
        .select()
        .single();
      
      if (error) {
        console.error("API: Erreur Supabase lors de l'insertion:", error);
        return NextResponse.json(
          { error: `Erreur lors de l'enregistrement: ${error.message}` },
          { status: 500 }
        );
      }
      
      console.log("API: Réservation enregistrée avec succès:", data);
      
      return NextResponse.json(
        { success: true, data },
        { status: 201 }
      );
    } catch (supabaseError) {
      console.error("API: Erreur lors de la création du client Supabase ou de l'insertion:", supabaseError);
      return NextResponse.json(
        { error: `Erreur avec Supabase: ${supabaseError instanceof Error ? supabaseError.message : String(supabaseError)}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API: Erreur lors du traitement de la réservation:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Erreur lors du traitement de la réservation: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// Suppression de la fonction GET pour simplifier et éviter les erreurs de compilation 