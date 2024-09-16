"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set } from "lodash"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updateSkyfireAPIKey } from "../context/action"
import { useSkyfire } from "../context/context"
import { setApiKeyToLocalStorage } from "../util"

const FormSchema = z.object({
  apikey: z
    .string()
    .refine(
      (value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value ?? ""
        ),
      "Invalid API key format"
    ),
})

export function ApiKeyConfig() {
  const { dispatch } = useSkyfire()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apikey: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = setApiKeyToLocalStorage(data.apikey)
    if (res) dispatch(updateSkyfireAPIKey(data.apikey))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="apikey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skyfire API Key</FormLabel>
              <FormControl>
                <Input placeholder="API Key" {...field} />
              </FormControl>
              <FormDescription>
                If you do not have an API Key, please visit app.skyfire.xyz
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save it locally</Button>
      </form>
    </Form>
  )
}
