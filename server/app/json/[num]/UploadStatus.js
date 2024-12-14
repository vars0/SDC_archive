export default function UploadStatus({ status }) {
    return (
      <span
        style={{
          color:
            status === "error"
              ? "red"
              : status === "success"
              ? "green"
              : "black",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {status === "uploading" && (
          <>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                border: "2px solid black",
                borderRadius: "50%",
                borderTopColor: "transparent",
                animation: "spin 1s linear infinite",
              }}
            ></span>
            업로드 중...
          </>
        )}
        {status === "success" && "업로드 성공!"}
        {status === "error" && "업로드 실패!"}
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </span>
    );
  }
  