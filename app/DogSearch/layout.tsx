import { ReactNode } from "react";

export default function DogSearchLayout({ children }: {children:ReactNode}) {
  return (
    <section>
      {children}
    </section>
  )
}