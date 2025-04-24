"use client";

import { createCourseSchema } from "../validators/course";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { notify } from "./ui/sonner";
import SubscriptionAction from "./SubscriptionAction";

type FormInput = z.infer<typeof createCourseSchema>;

const CreateCourseForm = ({ isPro }: { isPro: boolean }) => {
  const router = useRouter();
  const { mutate: createChapters, isLoading } = useMutation({
    mutationFn: async ({ title, units }: FormInput) => {
      const response = await axios.post("/api/course/createChapters", {
        title,
        units,
      });
      return response.data;
    },
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  function onSubmit(values: z.infer<typeof createCourseSchema>) {
    console.log(values);

    const hasEmptyUnit = values.units.some((unit) => unit === "");
    if (hasEmptyUnit) {
      notify({
        title: "Error",
        description: "Please fill in all the units",
        variant: "destructive",
      });
      return;
    }

    createChapters(values, {
      onSuccess: ({ course_id }) => {
        console.log(course_id);
        notify({
          title: "Success",
          description: "Course created successfully",
        });
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        console.log(error);
        notify({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }

  form.watch();
  console.log(form.watch("units"));
  return (
    <>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mt-6 space-y-6 bg-muted/40 p-6 rounded-2xl shadow-lg border border-border"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Course Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Learn Web Development"
                  className="bg-background text-foreground placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Enter the Main Topic of the Course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <AnimatePresence>
          {form.watch("units").map((_, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: {
                    duration: 0.2,
                  },
                  height: {
                    duration: 0.2,
                  },
                }}
              >
                <FormField
                  key={index}
                  control={form.control}
                  name={`units.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex sm:items-center sm:space-x-4">
                      <FormLabel className="text-lg font-semibold">
                        Unit {index + 1}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          placeholder="Enter the SubTopic of the Course"
                          className="bg-background text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex items-center"
                        onClick={() => {
                          form.setValue(
                            "units",
                            form.watch("units").filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                        <Trash className="w-4 h-4 ml-2 text-destructive-foreground" />
                      </Button>
                    </FormItem>
                  )}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div className="flex items-center justify-center mt-4">
          <Separator className="flex-1" />
          <div className="flex space-x-4 mx-4">
            <Button
              type="button"
              variant="secondary"
              className="font-semibold cursor-pointer flex items-center"
              onClick={() =>
                form.setValue("units", [...form.watch("units"), ""])
              }
            >
              Add Unit
              <Plus className="w-4 h-4 ml-2 text-green-500" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-semibold cursor-pointer flex items-center"
              onClick={() =>
                form.setValue("units", form.watch("units").slice(0, -1))
              }
            >
              Remove Unit
              <Trash className="w-4 h-4 ml-2 text-red-500" />
            </Button>
          </div>
          <Separator className="flex-1" />
        </div>

        {/* Add dynamic inputs for Units later if needed */}

        <div className="flex cursor-pointer justify-end">
          <Button
            disabled={isLoading}
            type="submit"
            className="px-6 py-2 cursor-pointer text-md"
          >
            Let's Go
          </Button>
        </div>
      </form>
    </Form>
    {!isPro && <SubscriptionAction/>}
    </>
  );
};

export default CreateCourseForm;
