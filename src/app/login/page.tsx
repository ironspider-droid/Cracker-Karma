'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Leaf, Loader2, Mail, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebase } from '@/firebase';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const newUser = userCredential.user;
        // Create user profile in Firestore
        const userRef = doc(firestore, 'users', newUser.uid);
        await setDoc(
          userRef,
          {
            id: newUser.uid,
            email: newUser.email,
            budget: 1000,
            theme: 'system',
            registrationDate: new Date().toISOString(),
          },
          { merge: false }
        );
        toast({ title: 'Registration successful!' });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Login successful!' });
      }
      router.push('/');
    } catch (error: any) {
      const errorCode = error.code || 'unknown';
      let errorMessage = 'An unexpected error occurred.';
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage =
          'This email is already registered. Please log in or use a different email.';
      } else if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Invalid password. Please try again.';
      } else if (errorCode === 'auth/user-not-found') {
        errorMessage =
          'No account found with this email. Please register first.';
      }
      toast({
        variant: 'destructive',
        title: isRegistering ? 'Registration Failed' : 'Login Failed',
        description: errorMessage,
      });
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Leaf className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">Cracker Karma</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? 'Enter your details to start your journey.'
              : 'Sign in to manage your cracker budget.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <KeyRound className="mr-2 h-4 w-4" /> Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRegistering ? 'Register' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={isSubmitting}
          >
            {isRegistering
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
