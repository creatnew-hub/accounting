// 从浏览器本地存储读取数据，没有就为空数组
let records = JSON.parse(localStorage.getItem('shopRecords')) || [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 日期默认今天
    document.getElementById('date').valueAsDate = new Date();
    render();
});

// 添加记录
function addRecord() {
    const date = document.getElementById('date').value;
    const item = document.getElementById('item').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    // 简单校验
    if (!date || !item || isNaN(amount)) {
        alert('请填写完整信息');
        return;
    }

    const record = {
        id: Date.now(),      // 用时间戳当唯一ID
        date: date,
        item: item,
        amount: amount
    };

    records.unshift(record);  // 新记录放最前面
    save();
    render();
    clearInput();
}

// 删除记录
function deleteRecord(id) {
    records = records.filter(r => r.id !== id);
    save();
    render();
}

// 保存到本地存储
function save() {
    localStorage.setItem('shopRecords', JSON.stringify(records));
}

// 渲染页面
function render() {
    const tbody = document.getElementById('recordList');
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-tip">暂无记录，记一笔吧~</td></tr>';
    } else {
        tbody.innerHTML = records.map(r => `
            <tr>
                <td>${r.date}</td>
                <td>${r.item}</td>
                <td class="amount ${r.amount >= 0 ? 'positive' : 'negative'}">
                    ${r.amount >= 0 ? '+' : ''}${r.amount.toFixed(2)}
                </td>
                <td><button class="delete" onclick="deleteRecord(${r.id})">删除</button></td>
            </tr>
        `).join('');
    }

    // 计算统计
    const income = records.filter(r => r.amount > 0).reduce((sum, r) => sum + r.amount, 0);
    const expense = records.filter(r => r.amount < 0).reduce((sum, r) => sum + r.amount, 0);
    const balance = income + expense;

    document.getElementById('income').textContent = income.toFixed(2);
    document.getElementById('expense').textContent = Math.abs(expense).toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// 清空输入框
function clearInput() {
    document.getElementById('item').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('item').focus();
}

// 回车快捷记账
document.getElementById('amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addRecord();
});