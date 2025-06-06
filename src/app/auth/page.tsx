'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ANAYASS</h1>
          <h2 className="mt-6 text-xl text-gray-600">Tableau de bord</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            showLinks={true}
            magicLink={false}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full bg-blue-600 text-white hover:bg-blue-700',
                input: 'w-full rounded-md border-gray-300',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Adresse e-mail',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                  password_input_placeholder: 'Votre mot de passe',
                  email_input_placeholder: 'Votre adresse e-mail',
                  link_text: 'Déjà inscrit ? Connectez-vous',
                },
                forgotten_password: {
                  email_label: 'Adresse e-mail',
                  password_label: 'Mot de passe',
                  button_label: 'Envoyer les instructions',
                  loading_button_label: 'Envoi en cours...',
                  link_text: 'Mot de passe oublié ?',
                  confirmation_text: 'Vérifiez vos emails pour réinitialiser votre mot de passe',
                },
              },
            }}
            theme="default"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
} 