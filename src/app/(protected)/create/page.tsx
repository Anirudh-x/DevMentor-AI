"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefetch from '@/hooks/use-refetch';
import { appRouter } from '@/server/api/root';
import { api } from '@/trpc/react';
import { Info } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
}

const CreatePage = () => {

  const { register, handleSubmit, reset } = useForm<FormInput>({});
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation()
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {

    if (!!checkCredits.data) {
      createProject.mutate({
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      }, {
        onSuccess: () => {
          toast.success("Project created successfully!");
          refetch()
          reset();
        },
        onError: () => {
          toast.error("Failed to create project. Please try again.");
        },
      });
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      })
    }

    return true;
  }

  const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits.data.fileCount <= checkCredits.data.userCredits : true

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <img src='/gitlab.svg' className='h-[12rem] w-[12rem]' />
      <div>
        <div>
          <h1 className='font-semibold text-2xl'>
            Link your GitLab repository to DevMentor AI
          </h1>

          <p className='text-sm text-muted-foreground'>
            To get started, please provide the URL of your GitLab repository.
          </p>
        </div>
        <div className='h-4'></div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('projectName', { required: true })}
              placeholder='Project Name'
              required
            />
            <div className='h-2'></div>
            <Input
              {...register('repoUrl', { required: true })}
              placeholder='Github URL'
              type='url'
              required
            />
            <div className='h-2'></div>
            <Input
              {...register('githubToken')}
              placeholder='Github Token (Optional)'
            />
            {
              !!checkCredits.data && (
                <>
                  <div className='mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700'>
                    <div className='flex items-center gap-2'>
                      <Info className='size-4' />
                      <p className='text-sm'>You will be charged <strong>{checkCredits.data?.fileCount}</strong> credits for this repository.</p>
                    </div>
                    <p className='text-sm text-blue-600 ml-6'>
                      You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining.
                    </p>
                  </div>
                </>
              )
            }

            <div className='h-4'></div>
            <Button type='submit' disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits}>
              {!!checkCredits.data ? "Create Project" : "Check Credits"}
            </Button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default CreatePage