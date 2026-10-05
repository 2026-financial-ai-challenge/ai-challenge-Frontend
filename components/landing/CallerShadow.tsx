import Image from "next/image";

/**
 * 수신·거절·통화 화면이 같이 쓰는 배경.
 * 누가 거는 전화인지는 끝까지 드러나지 않으므로, 상태가 바뀌어도
 * 발신자 그림은 그대로 둔다.
 *
 * 다만 거절 화면은 잠금화면이다. 실제 휴대전화도 발신자 사진은 수신·통화
 * 화면에만 띄우고 끊으면 제 배경화면으로 돌아가므로, 그때는 `caller`를
 * 꺼서 그라데이션만 남긴다. 색이 이어져 화면 전환은 그대로 자연스럽다.
 */

export function CallerShadow({ caller = true }: { caller?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/*
        발신자가 검정 후드라, 바탕이 검정이면 실루엣이 통째로 묻힌다.
        위를 밝게 띄운 그라데이션을 깔아 윤곽이 드러나게 한다.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #4a5465 0%, #3a4252 38%, #262c38 68%, #16181f 100%)",
        }}
      />

      {/* 프로필 사진이 아니라 화면을 채우는 배경이다. 아래는 녹여 잘린 티를 없앤다. */}
      {caller && (
        <Image
          src="/landing/caller.png"
          alt=""
          width={720}
          height={733}
          priority
          className="absolute left-1/2 top-[6%] w-[128%] max-w-none -translate-x-1/2"
          style={{
            maskImage:
              "linear-gradient(180deg, #000 56%, rgba(0,0,0,0.35) 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, #000 56%, rgba(0,0,0,0.35) 80%, transparent 100%)",
          }}
        />
      )}

      {/* 번호와 슬라이더가 그림 위에 올라타도 읽히게, 위아래만 눌러 둔다. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,11,15,0.72) 0%, rgba(10,11,15,0.28) 14%, rgba(10,11,15,0) 32%, rgba(10,11,15,0) 60%, rgba(10,11,15,0.78) 82%, rgba(10,11,15,0.96) 100%)",
        }}
      />
    </div>
  );
}
