import React from 'react';

interface SkeletonProps {
  className?: string;
  key?: React.Key | null | undefined;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`bg-slate-200 dark:bg-zinc-800 animate-pulse rounded-xl ${className}`}
    />
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-4 border-b border-line">
          <div className="flex items-center gap-3 w-full max-w-md">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="space-y-1.5 w-full">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-md shrink-0" />
          <Skeleton className="h-4 w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Sandbox Controller Skeleton */}
      <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
          <div className="space-y-2 w-full max-w-xs">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <Skeleton className="h-9 w-40 shrink-0" />
      </div>

      {/* Hero Header Card Skeleton */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-3 w-2/3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-8 w-28 shrink-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-zinc-800 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="space-y-1 w-full">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Quick Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Table Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar logs card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border border-slate-100 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmployeesSkeleton() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 w-full max-w-sm">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-36 shrink-0" />
      </div>

      {/* Directory Content Skeleton */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4 border border-slate-100 dark:border-zinc-800 rounded-xl">
              <div className="flex items-center gap-4 w-full">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GmailSkeleton() {
  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 w-full max-w-sm">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-44 shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-slate-100 dark:border-zinc-800 rounded-xl space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
