import { getUserProfileApi, updateProfileApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile } from "@/redux/slices/profileSlice";
import { RootState } from "@/redux/store";
import { requestHandler } from "@/utils";
import { FaSpinner } from "react-icons/fa";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { EditProfileInterface, editProfileSchema } from "@/interfaces/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/calendar";
import { CalendarIcon } from "lucide-react";

// TODO: experiment with zod
const EditProfilePage = () => {
  const { userProfile: profile } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const getUserProfilehandler = async () => {
    await requestHandler(
      async () => await getUserProfileApi(user!.username),
      setLoading,
      (res) => {
        dispatch(
          getUserProfile({
            userProfile: res.data,
          })
        );
      },
      (error) => {
        toast.error(error);
        navigate("/");
      }
    );
  };

  const form = useForm<EditProfileInterface>({
    resolver: zodResolver(editProfileSchema),
  });

  const setDefaultValues = () => {
    if (profile) {
      form.setValue("firstName", profile.firstName);
      form.setValue("lastName", profile!.lastName);
      form.setValue("bio", profile.bio);
      form.setValue("phoneNumber", profile.phoneNumber);
      form.setValue("countryCode", profile.countryCode);
      form.setValue("location", profile.location);
      const date = new Date(profile?.dob);
      form.setValue("dob", date);
    }
  };

  const updateProfileHandler = async (values: EditProfileInterface) => {
    console.log(values);
    let data;
    if (values.dob) {
      data = { ...values, dob: values.dob.toISOString() };
    } else {
      data = values;
    }

    await requestHandler(
      async () => await updateProfileApi(data),
      setIsSaving,
      (res) => {
        dispatch(
          getUserProfile({
            userProfile: res.data,
          })
        );
        toast.success(res.message);
        navigate(`/user/${profile?.account.username}`);
      },
      (error) => {
        console.log(error);
        toast.error(error);
      }
    );
  };

  useEffect(() => {
    if (!profile) {
      getUserProfilehandler();
    }
    if (profile) {
      setDefaultValues();
    }
  }, [profile]);

  return (
    <div className=" container overflow-y-auto flex justify-start md:absolute md:top-[70px] md:left-[150px] lg:left-[200px] max-h-[calc(100vh-70px)] md:max-w-[calc(100vw-150px)] lg:max-w-[calc(100vw-200px)] p-0 pt-3 md:p-3">
      <div className="self-start container max-lg:!p-1  lg:ml-0">
        <div className="relative max-h-[100vh-70px] overflow-y-auto">
          {loading ? (
            <>
              {/* TODO: add loading screen here */}
              <h2>Loading</h2>
            </>
          ) : (
            <Card className="p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(updateProfileHandler)}
                  className="w-full space-y-5"
                >
                  <div className="flex gap-5 my-5 max-sm:flex-wrap w-full">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter yout first name"
                              {...field}
                              className="px-3 py-2 "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter yout last name"
                              {...field}
                              className="px-3 py-2 w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your bio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="w-full gap-3 flex">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="w-[30%]">
                          <FormLabel>Country Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Country Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="w-[70%]">
                          <FormLabel>Phone No.</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number.."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  " pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              fromYear={1924}
                              toYear={2024}
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isSaving} type="submit">
                    {isSaving ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Update Account"
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
