"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";




const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3)

  })
}


const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {

      if (type === 'sign-up')
      {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        });

        if (!result?.success)
        {
          toast.error(result?.message);
          return;
        }

        toast.success('Account created successfully')
        router.push('/sign-in');
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();

        if (!idToken)
        {
          toast.error('Signing in failed! no id token!');
          return;
        }

        await signIn({ email, idToken });
        toast.success('Logged in Successfully')
        router.push('/');
      }

    } catch (error) {
      console.log(error)
      toast.error(`There was an error while submiting the form ${error}`)
    }
    console.log(values)
  }

  const isSignIn = type === 'sign-in'
  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col  gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="./logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 mt-4 form">
            {!isSignIn && <FormField control={form.control} name={'name'} label={'Name'} placeholder="Your Name"  type="text"/>}
            <FormField
              control={form.control}
              name={'email'}
              label="Email"
              placeholder="Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              name={'password'}
              label="Password"
              placeholder="Your Password"
              type="password"
            />
            <Button type="submit">{isSignIn ? 'Sign In' : 'Create An Account'}</Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? 'Don\'t have an account yet?' : 'Already have an account?'}
          <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="font-bold text-user-primary ml-1">
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm