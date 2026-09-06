import { PortalMark } from "@/components/portal/PortalMark";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { PORTAL_AGENCY, portalHref } from "@/lib/portal";
import Link from "next/link";

export default function PortalHomePage() {
  return (
    <PortalChrome active="온라인민원">
      <section className="relative overflow-hidden bg-[#0f2d4e]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(212,179,106,0.18) 0%, transparent 42%), repeating-linear-gradient(-65deg, transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 19px)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1080px] gap-8 px-4 py-12 lg:grid-cols-[1.2fr_20rem] lg:items-center lg:py-16">
          <div className="text-white">
            <p className="text-sm font-semibold text-[#d4b36a]">등기송달 · 사건 열람</p>
            <h1 className="mt-2 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              등기송달 서류를
              <br />
              본인 확인 후 열람합니다
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
              {PORTAL_AGENCY}에 접수된 등기 관련 사건은 열람 대상자 본인만
              조회할 수 있습니다. 정면의 나의 사건 조회에서 진행해 주십시오.
            </p>
          </div>

          <Link
            href={portalHref("/inquiry")}
            className="block border-[3px] border-white bg-white/95 p-6 text-[#1a2433] shadow-[0_12px_30px_rgba(0,0,0,0.22)] hover:bg-white"
          >
            <p className="text-xs font-semibold tracking-wide text-[#5b6777]">
              온라인민원
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#123056]">나의 사건 조회</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
              사건번호로 등기송달 진행 상태를 확인합니다.
            </p>
            <span className="mt-5 inline-flex min-h-11 items-center bg-[#123056] px-4 text-sm font-semibold text-white">
              조회하기
            </span>
          </Link>
        </div>
      </section>

      <section id="online-minwon" className="mx-auto max-w-[1080px] px-4 py-10">
        <h2 className="text-xl font-bold text-[#123056]">온라인민원</h2>
        <p className="mt-2 text-sm text-[#5b6777]">
          배너 아래 민원 창구입니다. 열람이 필요한 경우 나의 사건 조회를
          이용하십시오.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href={portalHref("/inquiry")}
            className="border-[3px] border-white bg-white p-6 shadow-sm ring-1 ring-[#d7dee7] hover:ring-[#123056]"
          >
            <PortalMark className="h-10 w-10" />
            <h3 className="mt-4 text-lg font-bold text-[#123056]">나의 사건 조회</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
              사건번호와 성명으로 등기송달 진행 상태를 확인합니다.
            </p>
          </Link>
          <div className="border border-[#d7dee7] bg-white p-6">
            <h3 className="text-lg font-bold text-[#123056]">실명 인증</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
              회원가입이 되어 있지 않으면 실명 인증 후 열람할 수 있습니다.
            </p>
          </div>
          <div className="border border-[#d7dee7] bg-white p-6">
            <h3 className="text-lg font-bold text-[#123056]">등기송달 안내</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
              자택 수령이 어려운 경우 이 창구에서 내용 확인을 진행합니다.
            </p>
          </div>
        </div>
      </section>
    </PortalChrome>
  );
}
