import { useState } from "react";

type Props = {
  siteKey: string;
}

const ContactForm = ({ siteKey }: Props) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaResponse, setRecaptchaResponse] = useState<null | {
    score: number;
  }>(null);
  const [error, setError] = useState<null | string>(null);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecaptchaResponse(null);

    grecaptcha.ready(function () {
      grecaptcha
        .execute(siteKey, { action: "submit" })
        .then(async (token) => {
          const response = await fetch("/api/recaptcha", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setRecaptchaResponse(data);
            setError(null);
            setName("");
            setContent("");
          } else {
            setError("Something went wrong");
          }
          setLoading(false);
        });
    });
  };

  return (
    <form
      className="card p-5 space-y-4 bg-neutral text-neutral-content m-auto w-full"
      onSubmit={submitForm}
    >
      <p className="text-2xl font-bold text-blue-400">Form by React</p>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered"
        placeholder="Your name"
        required
      />
      <input
        type="text"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input input-bordered"
        placeholder="Content"
        required
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        Submit
      </button>
      {error && <div className="alert alert-error">{error}</div>}
      {recaptchaResponse && (
        <div
          className={`py-3 text-center rounded text-gray-800 ${
            recaptchaResponse.score >= 0.5 ? "bg-success" : "bg-error"
          }`}
        >
          <span>
            Your score is{" "}
            <span className="text-xl font-bold">
              {recaptchaResponse.score}
            </span>
            . You are probably{" "}
            {recaptchaResponse.score >= 0.5 ? "Human 😃 ️" : "Bot 🤖"}
          </span>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
