// manageDailyGifts.js
async function fetchMessages() {
    const res = await fetch('/daily-gifts');
    const data = await res.json();
    if (data.success) {
      const list = document.getElementById('messagesList');
      list.innerHTML = '';
      data.messages.forEach((msg, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${msg}</span>
          <div>
            <button class="delete" onclick="deleteMessage(${index})">حذف</button>
          </div>
        `;
        list.appendChild(li);
      });
    }
  }

  async function addMessage() {
    const msg = document.getElementById('newMessage').value.trim();
    if (!msg) return;
    const res = await fetch('/add-daily-gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    document.getElementById('statusMessage').innerText = data.message;
    document.getElementById('newMessage').value = '';
    fetchMessages();
  }

  async function deleteMessage(index) {
    const res = await fetch('/delete-daily-gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    });
    const data = await res.json();
    document.getElementById('statusMessage').innerText = data.message;
    fetchMessages();
  }


  fetchMessages();