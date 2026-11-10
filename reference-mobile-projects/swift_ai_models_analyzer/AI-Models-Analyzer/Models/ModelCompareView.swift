import SwiftUI
import Charts

struct ModelCompareView: View {
    @State private var modelA: AIModel = SampleData.models[0]
    @State private var modelB: AIModel = SampleData.models[1]
    @State private var showPickerA = false
    @State private var showPickerB = false

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                modelSelectors
                benchmarkRadar
                specComparisonCard
                benchmarkBarsCard
                verdictCard
            }
            .padding(.bottom, 32)
        }
        .background(AppTheme.secondaryBackground.ignoresSafeArea())
        .navigationTitle("Compare Models")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showPickerA) {
            ModelPickerSheet(selected: $modelA, excluding: modelB)
        }
        .sheet(isPresented: $showPickerB) {
            ModelPickerSheet(selected: $modelB, excluding: modelA)
        }
    }

    // MARK: - Model Selectors
    private var modelSelectors: some View {
        HStack(spacing: 12) {
            ModelSelectorButton(model: modelA, color: Color(hex: modelA.color)) {
                showPickerA = true
            }
            Image(systemName: "arrow.left.arrow.right")
                .font(.title3.bold())
                .foregroundStyle(AppTheme.textTertiary)
            ModelSelectorButton(model: modelB, color: Color(hex: modelB.color)) {
                showPickerB = true
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }

    // MARK: - Benchmark Radar (Bar Chart side by side)
    private var benchmarkRadar: some View {
        let dataA = benchmarkData(for: modelA)
        let dataB = benchmarkData(for: modelB)

        return VStack(alignment: .leading, spacing: 12) {
            Text("Benchmark Comparison")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            Chart {
                ForEach(dataA) { point in
                    BarMark(
                        x: .value("Task", point.label),
                        y: .value("Score", point.value),
                        width: .ratio(0.4)
                    )
                    .foregroundStyle(Color(hex: modelA.color).gradient)
                    .position(by: .value("Model", modelA.name))
                    .cornerRadius(4)
                }
                ForEach(dataB) { point in
                    BarMark(
                        x: .value("Task", point.label),
                        y: .value("Score", point.value),
                        width: .ratio(0.4)
                    )
                    .foregroundStyle(Color(hex: modelB.color).gradient)
                    .position(by: .value("Model", modelB.name))
                    .cornerRadius(4)
                }
            }
            .chartYScale(domain: 0...100)
            .chartForegroundStyleScale([
                modelA.name: Color(hex: modelA.color),
                modelB.name: Color(hex: modelB.color)
            ])
            .frame(height: 200)
            legendRow
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var legendRow: some View {
        HStack(spacing: 20) {
            HStack(spacing: 6) {
                Circle().fill(Color(hex: modelA.color)).frame(width: 10, height: 10)
                Text(modelA.name).font(.caption).foregroundStyle(AppTheme.textSecondary)
            }
            HStack(spacing: 6) {
                Circle().fill(Color(hex: modelB.color)).frame(width: 10, height: 10)
                Text(modelB.name).font(.caption).foregroundStyle(AppTheme.textSecondary)
            }
            Spacer()
        }
    }

    // MARK: - Spec Comparison
    private var specComparisonCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Specifications")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            VStack(spacing: 0) {
                specHeaderRow
                Divider()
                specRow(label: "Provider", a: modelA.provider, b: modelB.provider)
                specRow(label: "Category", a: modelA.category, b: modelB.category)
                specRow(label: "Parameters", a: modelA.parameterCount, b: modelB.parameterCount)
                specRow(label: "Context", a: modelA.contextWindow, b: modelB.contextWindow)
                specRow(label: "License", a: modelA.license, b: modelB.license)
                specRow(label: "Released", a: modelA.releaseDate, b: modelB.releaseDate)
                specRow(label: "Input Cost", a: modelA.inputCost, b: modelB.inputCost)
                specRow(label: "Output Cost", a: modelA.outputCost, b: modelB.outputCost)
                ratingRow
            }
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private var specHeaderRow: some View {
        HStack {
            Text("Spec")
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textTertiary)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(modelA.name)
                .font(.caption.bold())
                .foregroundStyle(Color(hex: modelA.color))
                .frame(maxWidth: .infinity, alignment: .center)
                .lineLimit(1)
            Text(modelB.name)
                .font(.caption.bold())
                .foregroundStyle(Color(hex: modelB.color))
                .frame(maxWidth: .infinity, alignment: .center)
                .lineLimit(1)
        }
        .padding(.vertical, 8)
    }

    private func specRow(label: String, a: String, b: String) -> some View {
        HStack {
            Text(label)
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(a)
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .frame(maxWidth: .infinity, alignment: .center)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(b)
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .frame(maxWidth: .infinity, alignment: .center)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .padding(.vertical, 8)
        .background(AppTheme.secondaryBackground.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 6))
        .padding(.vertical, 1)
    }

    private var ratingRow: some View {
        HStack {
            Text("Rating")
                .font(.caption)
                .foregroundStyle(AppTheme.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)
            ratingStars(rating: modelA.rating, color: Color(hex: modelA.color))
                .frame(maxWidth: .infinity)
            ratingStars(rating: modelB.rating, color: Color(hex: modelB.color))
                .frame(maxWidth: .infinity)
        }
        .padding(.vertical, 8)
        .background(AppTheme.secondaryBackground.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 6))
        .padding(.vertical, 1)
    }

    private func ratingStars(rating: Double, color: Color) -> some View {
        HStack(spacing: 2) {
            Image(systemName: "star.fill")
                .font(.caption2)
                .foregroundStyle(.orange)
            Text(String(format: "%.1f", rating))
                .font(.caption.bold())
                .foregroundStyle(AppTheme.textPrimary)
        }
    }

    // MARK: - Benchmark Bars
    private var benchmarkBarsCard: some View {
        let tasks = ["Reasoning", "Coding", "Math", "Language", "Safety"]
        let aScores = benchmarkData(for: modelA)
        let bScores = benchmarkData(for: modelB)

        return VStack(alignment: .leading, spacing: 14) {
            Text("Head-to-Head Scores")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            ForEach(Array(zip(aScores, bScores)), id: \.0.id) { (aPoint, bPoint) in
                BenchmarkCompareRow(
                    label: aPoint.label,
                    scoreA: aPoint.value,
                    scoreB: bPoint.value,
                    colorA: Color(hex: modelA.color),
                    colorB: Color(hex: modelB.color)
                )
            }
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    // MARK: - Verdict
    private var verdictCard: some View {
        let winner = modelA.rating >= modelB.rating ? modelA : modelB
        let loser = modelA.rating >= modelB.rating ? modelB : modelA
        let diff = abs(modelA.rating - modelB.rating)

        return VStack(alignment: .leading, spacing: 12) {
            Label("AI Verdict", systemImage: "trophy.fill")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
            HStack(spacing: 12) {
                Image(systemName: winner.iconSymbol)
                    .font(.title2)
                    .foregroundStyle(Color(hex: winner.color))
                    .frame(width: 52, height: 52)
                    .background(Color(hex: winner.color).opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Text(winner.name)
                            .font(.subheadline.bold())
                            .foregroundStyle(AppTheme.textPrimary)
                        Text("WINNER")
                            .font(.caption2.bold())
                            .foregroundStyle(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(AppTheme.success)
                            .clipShape(Capsule())
                    }
                    Text(verdictText(winner: winner, loser: loser, diff: diff))
                        .font(.caption)
                        .foregroundStyle(AppTheme.textSecondary)
                        .lineSpacing(3)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
    }

    private func verdictText(winner: AIModel, loser: AIModel, diff: Double) -> String {
        if diff < 0.1 {
            return "\(winner.name) and \(loser.name) are nearly identical in overall performance. Choose based on cost and licensing."
        } else if diff < 0.3 {
            return "\(winner.name) edges out \(loser.name) by a small margin. Both are strong choices depending on your use case."
        } else {
            return "\(winner.name) outperforms \(loser.name) by \(String(format: "%.1f", diff)) points. It's the clear choice for most production workloads."
        }
    }

    private func benchmarkData(for model: AIModel) -> [ChartDataPoint] {
        let base = model.rating / 5.0
        return [
            ChartDataPoint(label: "Reasoning", value: base * 95),
            ChartDataPoint(label: "Coding", value: base * 88),
            ChartDataPoint(label: "Math", value: base * 80),
            ChartDataPoint(label: "Language", value: base * 97),
            ChartDataPoint(label: "Safety", value: base * 92),
        ]
    }
}

// MARK: - Model Selector Button
struct ModelSelectorButton: View {
    let model: AIModel
    let color: Color
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 8) {
                Image(systemName: model.iconSymbol)
                    .font(.title3)
                    .foregroundStyle(color)
                    .frame(width: 50, height: 50)
                    .background(color.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                Text(model.name)
                    .font(.caption.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                    .lineLimit(1)
                Text("Tap to change")
                    .font(.caption2)
                    .foregroundStyle(AppTheme.textTertiary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(AppTheme.cardBackground)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .strokeBorder(color.opacity(0.3), lineWidth: 1.5)
            )
        }
    }
}

// MARK: - Benchmark Compare Row
struct BenchmarkCompareRow: View {
    let label: String
    let scoreA: Double
    let scoreB: Double
    let colorA: Color
    let colorB: Color

    var body: some View {
        VStack(spacing: 6) {
            HStack {
                Text(label)
                    .font(.caption.bold())
                    .foregroundStyle(AppTheme.textSecondary)
                Spacer()
                Text(String(format: "%.0f", scoreA))
                    .font(.caption.bold())
                    .foregroundStyle(colorA)
                Text("vs")
                    .font(.caption2)
                    .foregroundStyle(AppTheme.textTertiary)
                Text(String(format: "%.0f", scoreB))
                    .font(.caption.bold())
                    .foregroundStyle(colorB)
            }
            GeometryReader { geo in
                let w = geo.size.width
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4).fill(AppTheme.secondaryBackground).frame(height: 8)
                    RoundedRectangle(cornerRadius: 4).fill(colorA.opacity(0.4)).frame(width: w * scoreA / 100, height: 8)
                    RoundedRectangle(cornerRadius: 4).fill(colorB).frame(width: w * scoreB / 100, height: 4)
                        .offset(y: 2)
                }
            }
            .frame(height: 8)
        }
    }
}

// MARK: - Model Picker Sheet
struct ModelPickerSheet: View {
    @Binding var selected: AIModel
    let excluding: AIModel
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            List(SampleData.models.filter { $0.id != excluding.id }) { model in
                Button {
                    selected = model
                    dismiss()
                } label: {
                    HStack(spacing: 12) {
                        Image(systemName: model.iconSymbol)
                            .font(.body)
                            .foregroundStyle(Color(hex: model.color))
                            .frame(width: 36, height: 36)
                            .background(Color(hex: model.color).opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        VStack(alignment: .leading, spacing: 2) {
                            Text(model.name).font(.subheadline.bold()).foregroundStyle(AppTheme.textPrimary)
                            Text(model.provider).font(.caption).foregroundStyle(AppTheme.textSecondary)
                        }
                        Spacer()
                        if model.id == selected.id {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(AppTheme.primaryGradientStart)
                        }
                    }
                }
            }
            .navigationTitle("Select Model")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
