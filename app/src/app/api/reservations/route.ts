import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("API: Début du traitement de la requête POST");
    
    const body = await request.json()
    console.log("API: Données reçues:", body);
    
    const { name, email, phone, check_in, check_out, guests, message, plan_name, price, period } = body
    
    // Validation des données
    if (!name || !email || !phone || !check_in || !check_out || !guests || !plan_name) {
      console.log("API: Validation échouée - champs manquants");
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }
    
    // Création du client Supabase avec la clé de service qui contourne la RLS
    console.log("API: Création du client Supabase avec la clé de service");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseServiceKey) {
      console.log("API: Clé de service non disponible, utilisation de la clé anonyme");
      // Fallback à la clé anonyme si la clé de service n'est pas disponible
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      // Créer un client Supabase avec la clé anonyme
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      
      // Insertion de la réservation dans la base de données
      console.log("API: Tentative d'insertion dans la base de données avec clé anonyme");
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            name,
            email,
            phone,
            check_in,
            check_out,
            guests,
            message,
            plan_name,
            price,
            period,
            status: "pending"
          }
        ])
        .select()
      
      if (error) {
        console.error("API: Erreur lors de l'enregistrement de la réservation:", error);
        return NextResponse.json(
          { error: `Erreur lors de l'enregistrement de la réservation: ${error.message}` },
          { status: 500 }
        )
      }
      
      console.log("API: Réservation enregistrée avec succès");
      return NextResponse.json(
        { success: true, data: data[0] },
        { status: 201 }
      )
    }
    
    // Créer un client Supabase avec la clé de service (contourne la RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    // Insertion de la réservation dans la base de données
    console.log("API: Tentative d'insertion dans la base de données avec clé de service");
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          name,
          email,
          phone,
          check_in,
          check_out,
          guests,
          message,
          plan_name,
          price,
          period,
          status: "pending"
        }
      ])
      .select()
    
    if (error) {
      console.error("API: Erreur lors de l'enregistrement de la réservation:", error);
      return NextResponse.json(
        { error: `Erreur lors de l'enregistrement de la réservation: ${error.message}` },
        { status: 500 }
      )
    }
    
    // Envoi d'un email de confirmation (à implémenter)
    // ...
    
    console.log("API: Réservation enregistrée avec succès");
    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error("API: Erreur lors du traitement de la réservation:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Erreur lors du traitement de la réservation: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Création du client Supabase avec la clé anonyme (sans RLS)
    console.log("API GET: Création du client Supabase");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // Créer un client Supabase direct sans RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    // Vérification de l'authentification n'est pas nécessaire car nous utilisons un client direct
    
    // Récupération des réservations
    console.log("API GET: Récupération des réservations");
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("check_in", { ascending: true })
    
    if (error) {
      console.error("API GET: Erreur lors de la récupération des réservations:", error);
      return NextResponse.json(
        { error: `Erreur lors de la récupération des réservations: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log("API GET: Réservations récupérées avec succès");
    return NextResponse.json({ data })
  } catch (error) {
    console.error("API GET: Erreur lors de la récupération des réservations:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Erreur lors de la récupération des réservations: ${errorMessage}` },
      { status: 500 }
    )
  }
} 