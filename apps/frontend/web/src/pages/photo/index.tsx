import { TakePhoto } from '@/components/photo/take-photo';
import { TakePhotoForm } from '@/components/photo/take-photo-form';

export default function Photo() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-10">
          <TakePhoto isBefore={true} />
          <TakePhoto isBefore={false} />
        </div>
        <TakePhotoForm />
      </div>
    </main>
  );
}
