document.addEventListener("DOMContentLoaded", function () {
    let expenseChart;
    let incomeExpenseChart;

    function initializeCharts() {
        let ctx = document.getElementById("expenseChart").getContext("2d");
        let incomeCtx = document.getElementById("incomeExpenseChart").getContext("2d");

        expenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["住居費", "食費", "通信費", "交通費", "被服費", "娯楽費", "消耗品", "水道光熱費","その他"],
                datasets: [{
                    label: "支出（円）",
                    data: [0, 0, 0, 0, 0, 0, 0, 0,0],
                    backgroundColor: ["#ff9999", "#66b3ff", "#99ff99", "#ffcc99", "#c2c2f0", "#ffb3e6", "#ff6666", "#FFD700", "#8A2BE2"]
                }]
            }
        });

        incomeExpenseChart = new Chart(incomeCtx, {
            type: "bar",
            data: {
                labels: ["収入", "支出 + 控除"],
                datasets: [{
                    label: "金額（円）",
                    data: [0, 0],
                    backgroundColor: ["#4CAF50", "#FF5733"]
                }]
            }
        });
    }

    function calculateBudget() {
        let income = parseInt(document.getElementById("income").value);
        let totalExpense = 0;
        let overLimitCategories = [];

        let categories = [
            { id: "rent", name: "住居費", average: 50000, advice: "家賃が高い場合は、より安い物件を検討するか、ルームシェアを考えてみてください。" },
            { id: "food", name: "食費", average: 30000, advice: "外食を減らし、自炊を増やすと食費を節約できます。" },
            { id: "internet", name: "通信費", average: 10000, advice: "通信費が高すぎる場合は、格安SIMの利用を検討してください。" },
            { id: "transportation", name: "交通費", average: 15000, advice: "定期券や自転車の活用を検討すると、交通費を削減できます。" },
            { id: "clothing", name: "被服費", average: 10000, advice: "セール品を活用したり、中古品を購入することで節約できます。" },
            { id: "entertainment", name: "娯楽費", average: 20000, advice: "サブスクを見直したり、無料イベントを活用しましょう。" },
            { id: "supplies", name: "消耗品", average: 10000, advice: "まとめ買いやディスカウントストアの活用を検討してください。" },
            { id: "utilities", name: "水道光熱費", average: 15000, advice: "電気・ガスのプランを見直し、省エネ家電を活用しましょう。" },
　　　　　  { id: "other", name: "その他", average: 0, advice: "出費が多い場合は見直しを検討してください。" }
                    ];

        let expenseValues = categories.map(category => {
            let value = parseInt(document.getElementById(category.id).value);
            totalExpense += value;
            if (value > category.average) {
                overLimitCategories.push(category);
            }
            return value;
        });

        let deductions = calculateDeductions(income);
        let remaining = income - totalExpense - deductions;

        document.getElementById("deductions").textContent = deductions.toLocaleString();
        document.getElementById("totalExpense").textContent = totalExpense.toLocaleString();
        document.getElementById("remaining").textContent = remaining.toLocaleString();

// 年間貯蓄額の計算
let annualSavings = remaining * 12;

// 年間貯蓄額の表示更新
document.getElementById("annualSavings").textContent = annualSavings.toLocaleString();


        // ❗️ 赤字時の警告メッセージの修正
        let warningMessage = document.getElementById("warningMessage");
        let adviceMessage = document.getElementById("adviceMessage");

        if (remaining < 0) {
            warningMessage.classList.remove("hidden");
            warningMessage.textContent = `⚠️ 赤字発生！（${Math.abs(remaining).toLocaleString()}円の赤字）`;

            let adviceText = "<b>節約のアドバイス：</b><br>";
            if (overLimitCategories.length > 0) {
                adviceText += overLimitCategories.map(c => `・${c.name}: ${c.advice}`).join("<br>");
            } else {
                adviceText += "固定費を見直して節約を検討してください。";
            }

            adviceMessage.classList.remove("hidden");
            adviceMessage.innerHTML = adviceText;
        } else {
            warningMessage.classList.add("hidden");
            adviceMessage.classList.add("hidden");
        }

        // ✅ グラフのデータを正しく更新
        expenseChart.data.datasets[0].data = expenseValues;
        expenseChart.update();

        incomeExpenseChart.data.datasets[0].data = [income, totalExpense + deductions];
        incomeExpenseChart.update();
    }

    function calculateDeductions(income) {
        return Math.round(income * 0.2); // 仮の計算
    }

    window.updateSlider = function (id) {
        document.getElementById(id + "Value").textContent = parseInt(document.getElementById(id).value).toLocaleString();
        calculateBudget();
    };

    initializeCharts();
    calculateBudget();
    document.getElementById("income").addEventListener("change", calculateBudget);
});
