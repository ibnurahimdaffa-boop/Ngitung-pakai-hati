const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const copyUI = document.getElementById("copy-ui");

let holdTimer = null;
let heldText = "";

send.onclick = sendMessage;

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    handleAI(text);
  }, 300);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;

  enableHoldToCopy(div, text);

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function enableHoldToCopy(element, text) {
  element.addEventListener("mousedown", (e) => {
    holdTimer = setTimeout(() => {
      heldText = text;
      copyUI.style.display = "block";
      copyUI.style.left = e.pageX + "px";
      copyUI.style.top = e.pageY + "px";
    }, 500);
  });

  element.addEventListener("mouseup", cancelHold);
  element.addEventListener("mouseleave", cancelHold);
}

function cancelHold() {
  clearTimeout(holdTimer);
}

copyUI.onclick = () => {
  navigator.clipboard.writeText(heldText);
  copyUI.style.display = "none";
};

document.body.onclick = (e) => {
  if (!copyUI.contains(e.target)) {
    copyUI.style.display = "none";
  }
};

function handleAI(inputText) {
  if (/[^0-9x+\-×÷!=¹²³⁴⁵⁶⁷⁸⁹!? .]/.test(inputText)) {
    aiReply("Symbol apa tuh?? Coba wa 62+ 0878-1631-8719 terus laporin bug ini.");
    return;
  }

  if (/^[0-9]+$/.test(inputText)) {
    aiReply("Untuk Soalnya Baru bisa dijawab Ai Kalau Soalnya ada symbol, seperti:6+7. Pertanyaan itu gagal buat Ai Matematika Daffa Ga berjalan. Silahkan coba dengan soal lain.");
    return;
  }

  if (/[a-wyzA-WYZ]/.test(inputText)) {
    aiReply("Maaf Ya Kakak² atau adik² penggemar Daffa🤭 kami baru bisa angka dulu ya, soalnya butuh modal buat beli api, tapi belum punya🤭.");
    return;
  }

  solveMath(inputText);
}

function aiReply(text) {
  addMessage(text, "ai");
}

function solveMath(expr) {
  try {
    let explanation = [];

    // pangkat superscript
    expr = expr.replace(/(\d)([¹²³⁴⁵⁶⁷⁸⁹])/g, (_, a, b) => {
      const pow = "¹²³⁴⁵⁶⁷⁸⁹".indexOf(b) + 1;
      explanation.push(`${a}${b} = ${a} pangkat ${pow}`);
      let result = a;
      for (let i = 1; i < pow; i++) {
        result *= a;
        explanation.push(`${result / a} x ${a} = ${result}`);
      }
      return result;
    });

    // faktorial
    expr = expr.replace(/(\d+)!/g, (_, n) => {
      let res = 1;
      explanation.push(`${n}! =`);
      for (let i = 1; i <= n; i++) {
        res *= i;
        explanation.push(`x ${i}`);
      }
      explanation.push(`= ${res}`);
      return res;
    });

    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

    const answer = eval(expr);

    aiReply(
      `Jawaban: ${answer}\n\nPenyelesaian:\n${explanation.join("\n")}\n\nPaham ga? Pasti paham karena Daffa Itu Ganteng🤭😵‍💫`
    );
  } catch {
    aiReply("Waduh error 😵‍💫 coba cek lagi soalnya ya.");
  }
}