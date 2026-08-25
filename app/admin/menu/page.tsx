'use client';

import Navigation from '@/components/Navbar';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function AdminMenuPage() {
  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-amber-700">←</Link>
              <h1 className="text-3xl font-bold text-slate-900">Kelola Menu</h1>
            </div>
            <Button>+ Tambah Menu</Button>
          </div>

          <Card>
            <CardBody>
              <p className="text-center text-slate-600 py-8">
                Fitur kelola menu sedang dalam pengembangan. Anda akan dapat menambah, mengedit, dan menghapus menu cafe di sini.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
