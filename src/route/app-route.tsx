import { Link, Route, Routes } from "react-router-dom";
import ScanPage from "../app/scan/page.tsx";
import DbPage from "../app/db/page.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LuQrCode, LuTable } from "react-icons/lu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";

export default function AppRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/db" element={<DbPage />} />
      </Routes>

      <nav className="flex h-screen justify-center m-5">
        <ButtonGroup>
          <HoverCard>
            <HoverCardTrigger
              delay={10}
              closeDelay={100}
              render={
                <Button variant="outline" asChild>
                  <Link to="/" className="inline-flex items-center gap-2">
                    <LuQrCode data-icon="inline-start" />
                    Scan QR
                  </Link>
                </Button>
              }
            />
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
              <div className="font-semibold">@nextjs</div>
              <div>
                The React Framework – created and maintained by @vercel.
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Joined December 2021
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              delay={10}
              closeDelay={100}
              render={
                <Button variant="outline" asChild>
                  <Link to="/db" className="inline-flex items-center gap-2">
                    <LuTable data-icon="inline-start" />
                    棚卸表
                  </Link>
                </Button>
              }
            />
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
              <div className="font-semibold">@nextjs</div>
              <div>
                The React Framework – created and maintained by @vercel.
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Joined December 2021
              </div>
            </HoverCardContent>
          </HoverCard>
        </ButtonGroup>
      </nav>
    </>
  );
}
