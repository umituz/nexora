import SwiftUI

// MARK: - Spreadsheet Viewer

struct SpreadsheetViewerView: View {
    let output: AgentOutput
    @State private var selectedTab = 0
    @State private var selectedCell: CellCoord? = nil

    private let tabs = ["Revenue", "Growth", "Scenarios"]

    var body: some View {
        VStack(spacing: 0) {
            // Sheet tabs
            sheetTabBar
            // Formula bar
            formulaBar
            // Table
            ScrollView([.horizontal, .vertical], showsIndicators: true) {
                spreadsheetTable
            }
            .background(Color(white: 0.06))
        }
    }

    @ViewBuilder
    private var sheetTabBar: some View {
        HStack(spacing: 0) {
            ForEach(tabs.indices, id: \.self) { i in
                Button {
                    withAnimation(.spring(duration: 0.2)) { selectedTab = i }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "tablecells")
                            .font(.caption2)
                            .foregroundStyle(selectedTab == i ? .green : .gray)
                        Text(tabs[i])
                            .font(.caption)
                            .fontWeight(selectedTab == i ? .semibold : .regular)
                            .foregroundStyle(selectedTab == i ? .white : .gray)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(selectedTab == i ? Color.white.opacity(0.08) : Color.clear)
                    .overlay(alignment: .bottom) {
                        if selectedTab == i {
                            Rectangle().fill(Color.green).frame(height: 2)
                        }
                    }
                }
            }
            Spacer()
            Button {} label: {
                Image(systemName: "plus").font(.caption).foregroundStyle(.gray).padding(10)
            }
        }
        .background(Color(white: 0.09))
    }

    @ViewBuilder
    private var formulaBar: some View {
        HStack(spacing: 10) {
            Text(selectedCell.map { "\(colLetter($0.col))\($0.row + 1)" } ?? "A1")
                .font(.system(size: 12, weight: .semibold, design: .monospaced))
                .foregroundStyle(.white)
                .frame(width: 40)
                .padding(.horizontal, 8)
                .padding(.vertical, 5)
                .background(Color.white.opacity(0.07))
                .clipShape(RoundedRectangle(cornerRadius: 6))
            Image(systemName: "fx")
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(.blue)
            Text(selectedCell != nil ? formulaForCell(selectedCell!) : "Select a cell")
                .font(.system(size: 12, design: .monospaced))
                .foregroundStyle(selectedCell != nil ? .white : .gray.opacity(0.5))
            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 7)
        .background(Color(white: 0.07))
    }

    @ViewBuilder
    private var spreadsheetTable: some View {
        let data = sheetData(for: selectedTab)
        VStack(spacing: 0) {
            // Column headers
            HStack(spacing: 0) {
                headerCell("", width: 44, isRowHeader: true)
                ForEach(data.headers.indices, id: \.self) { c in
                    headerCell(colLetter(c), width: colWidth(c, data: data), isRowHeader: false)
                }
            }
            Divider().background(Color.white.opacity(0.1))
            // Data rows
            ForEach(data.rows.indices, id: \.self) { r in
                HStack(spacing: 0) {
                    // Row number
                    Text("\(r + 1)")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundStyle(.gray)
                        .frame(width: 44)
                        .padding(.vertical, 8)
                        .background(Color.white.opacity(0.03))
                    // Cells
                    ForEach(data.rows[r].indices, id: \.self) { c in
                        let cell = data.rows[r][c]
                        let coord = CellCoord(row: r, col: c)
                        let isSelected = selectedCell == coord
                        Button {
                            withAnimation(.spring(duration: 0.15)) { selectedCell = coord }
                        } label: {
                            cellView(cell: cell, isSelected: isSelected, width: colWidth(c, data: data))
                        }
                    }
                }
                Divider().background(Color.white.opacity(0.05))
            }
        }
        .padding(.bottom, 40)
    }

    @ViewBuilder
    private func headerCell(_ label: String, width: CGFloat, isRowHeader: Bool) -> some View {
        Text(label)
            .font(.system(size: 11, weight: .semibold, design: .monospaced))
            .foregroundStyle(.gray)
            .frame(width: width, height: 30)
            .background(Color.white.opacity(isRowHeader ? 0.03 : 0.05))
    }

    @ViewBuilder
    private func cellView(cell: SheetCell, isSelected: Bool, width: CGFloat) -> some View {
        Text(cell.value)
            .font(.system(size: 12, design: .monospaced))
            .foregroundStyle(cellTextColor(cell))
            .fontWeight(cell.isBold ? .semibold : .regular)
            .lineLimit(1)
            .frame(width: width, alignment: cell.alignment)
            .padding(.horizontal, 8)
            .padding(.vertical, 8)
            .background(
                Group {
                    if isSelected {
                        Color.blue.opacity(0.2)
                    } else if cell.isHighlighted {
                        Color.green.opacity(0.08)
                    } else {
                        Color.clear
                    }
                }
            )
            .overlay(
                RoundedRectangle(cornerRadius: 0)
                    .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
            )
    }

    private func cellTextColor(_ cell: SheetCell) -> Color {
        if cell.isHeader { return .gray }
        if cell.value.hasPrefix("-") { return Color(red: 1, green: 0.4, blue: 0.4) }
        if cell.isHighlighted { return Color(red: 0.5, green: 0.95, blue: 0.6) }
        return .white
    }

    private func colLetter(_ i: Int) -> String {
        let letters = ["A","B","C","D","E","F","G","H"]
        return i < letters.count ? letters[i] : "?"
    }

    private func colWidth(_ col: Int, data: SheetData) -> CGFloat {
        col == 0 ? 130 : 100
    }

    private func formulaForCell(_ coord: CellCoord) -> String {
        let formulas = ["=B2*1.35", "=SUM(B2:B13)", "=CAGR(B2,B13,11)", "=NPV(0.12,C2:C13)"]
        return formulas[coord.col % formulas.count]
    }
}

// MARK: - Sheet Models

struct CellCoord: Equatable {
    let row: Int
    let col: Int
}

struct SheetCell {
    let value: String
    var isBold: Bool = false
    var isHeader: Bool = false
    var alignment: Alignment = .leading
    var isHighlighted: Bool = false
}

struct SheetData {
    let headers: [String]
    let rows: [[SheetCell]]
}

// MARK: - Sample Sheet Data

private func sheetData(for tab: Int) -> SheetData {
    switch tab {
    case 0: return revenueSheet
    case 1: return growthSheet
    default: return scenariosSheet
    }
}

private let revenueSheet = SheetData(
    headers: ["Month", "MRR ($)", "Customers", "ARPU", "Churn %"],
    rows: [
        [SheetCell(value: "Month", isBold: true, isHeader: true), SheetCell(value: "MRR ($)", isBold: true, isHeader: true), SheetCell(value: "Customers", isBold: true, isHeader: true), SheetCell(value: "ARPU", isBold: true, isHeader: true), SheetCell(value: "Churn %", isBold: true, isHeader: true)],
        [SheetCell(value: "Jan 2025"), SheetCell(value: "4,200", alignment: .trailing), SheetCell(value: "140", alignment: .trailing), SheetCell(value: "$30", alignment: .trailing), SheetCell(value: "3.2%", alignment: .trailing)],
        [SheetCell(value: "Feb 2025"), SheetCell(value: "6,800", alignment: .trailing), SheetCell(value: "210", alignment: .trailing), SheetCell(value: "$32", alignment: .trailing), SheetCell(value: "2.8%", alignment: .trailing)],
        [SheetCell(value: "Mar 2025"), SheetCell(value: "11,400", alignment: .trailing), SheetCell(value: "340", alignment: .trailing), SheetCell(value: "$34", alignment: .trailing), SheetCell(value: "2.4%", alignment: .trailing)],
        [SheetCell(value: "Apr 2025"), SheetCell(value: "18,200", alignment: .trailing), SheetCell(value: "520", alignment: .trailing), SheetCell(value: "$35", alignment: .trailing), SheetCell(value: "2.1%", alignment: .trailing)],
        [SheetCell(value: "May 2025"), SheetCell(value: "27,600", alignment: .trailing), SheetCell(value: "760", alignment: .trailing), SheetCell(value: "$36", alignment: .trailing), SheetCell(value: "1.9%", alignment: .trailing)],
        [SheetCell(value: "Jun 2025"), SheetCell(value: "41,000", alignment: .trailing), SheetCell(value: "1,100", alignment: .trailing), SheetCell(value: "$37", alignment: .trailing), SheetCell(value: "1.7%", alignment: .trailing)],
        [SheetCell(value: "Jul 2025"), SheetCell(value: "59,500", alignment: .trailing, isHighlighted: true), SheetCell(value: "1,580", alignment: .trailing, isHighlighted: true), SheetCell(value: "$38", alignment: .trailing), SheetCell(value: "1.5%", alignment: .trailing)],
        [SheetCell(value: "Aug 2025"), SheetCell(value: "84,000", alignment: .trailing, isHighlighted: true), SheetCell(value: "2,150", alignment: .trailing, isHighlighted: true), SheetCell(value: "$39", alignment: .trailing), SheetCell(value: "1.4%", alignment: .trailing)],
        [SheetCell(value: "Sep 2025"), SheetCell(value: "116,000", alignment: .trailing, isHighlighted: true), SheetCell(value: "2,870", alignment: .trailing, isHighlighted: true), SheetCell(value: "$40", alignment: .trailing), SheetCell(value: "1.2%", alignment: .trailing)],
        [SheetCell(value: "Oct 2025"), SheetCell(value: "158,000", alignment: .trailing, isHighlighted: true), SheetCell(value: "3,800", alignment: .trailing, isHighlighted: true), SheetCell(value: "$42", alignment: .trailing), SheetCell(value: "1.1%", alignment: .trailing)],
        [SheetCell(value: "Nov 2025"), SheetCell(value: "210,000", alignment: .trailing, isHighlighted: true), SheetCell(value: "4,900", alignment: .trailing, isHighlighted: true), SheetCell(value: "$43", alignment: .trailing), SheetCell(value: "1.0%", alignment: .trailing)],
        [SheetCell(value: "Dec 2025", isBold: true), SheetCell(value: "274,000", isBold: true, alignment: .trailing, isHighlighted: true), SheetCell(value: "6,200", isBold: true, alignment: .trailing, isHighlighted: true), SheetCell(value: "$44", alignment: .trailing), SheetCell(value: "0.9%", alignment: .trailing)],
    ]
)

private let growthSheet = SheetData(
    headers: ["Metric", "Q1", "Q2", "Q3", "Q4"],
    rows: [
        [SheetCell(value: "Metric", isBold: true, isHeader: true), SheetCell(value: "Q1", isBold: true, isHeader: true), SheetCell(value: "Q2", isBold: true, isHeader: true), SheetCell(value: "Q3", isBold: true, isHeader: true), SheetCell(value: "Q4", isBold: true, isHeader: true)],
        [SheetCell(value: "MoM Growth"), SheetCell(value: "62%", alignment: .trailing, isHighlighted: true), SheetCell(value: "51%", alignment: .trailing, isHighlighted: true), SheetCell(value: "44%", alignment: .trailing, isHighlighted: true), SheetCell(value: "38%", alignment: .trailing, isHighlighted: true)],
        [SheetCell(value: "New Users"), SheetCell(value: "490", alignment: .trailing), SheetCell(value: "1,340", alignment: .trailing), SheetCell(value: "2,870", alignment: .trailing), SheetCell(value: "5,100", alignment: .trailing)],
        [SheetCell(value: "Churn"), SheetCell(value: "-32", alignment: .trailing), SheetCell(value: "-68", alignment: .trailing), SheetCell(value: "-110", alignment: .trailing), SheetCell(value: "-160", alignment: .trailing)],
        [SheetCell(value: "Net Revenue"), SheetCell(value: "$22K", alignment: .trailing, isHighlighted: true), SheetCell(value: "$86K", alignment: .trailing, isHighlighted: true), SheetCell(value: "$260K", alignment: .trailing, isHighlighted: true), SheetCell(value: "$642K", alignment: .trailing, isHighlighted: true)],
        [SheetCell(value: "Burn Rate"), SheetCell(value: "$80K", alignment: .trailing), SheetCell(value: "$95K", alignment: .trailing), SheetCell(value: "$110K", alignment: .trailing), SheetCell(value: "$120K", alignment: .trailing)],
        [SheetCell(value: "Runway"), SheetCell(value: "24 mo", alignment: .trailing), SheetCell(value: "22 mo", alignment: .trailing), SheetCell(value: "20 mo", alignment: .trailing), SheetCell(value: "18 mo", alignment: .trailing)],
    ]
)

private let scenariosSheet = SheetData(
    headers: ["Scenario", "ARR 2025", "ARR 2026", "ARR 2027", "Valuation"],
    rows: [
        [SheetCell(value: "Scenario", isBold: true, isHeader: true), SheetCell(value: "ARR 2025", isBold: true, isHeader: true), SheetCell(value: "ARR 2026", isBold: true, isHeader: true), SheetCell(value: "ARR 2027", isBold: true, isHeader: true), SheetCell(value: "Valuation", isBold: true, isHeader: true)],
        [SheetCell(value: "Bear Case"), SheetCell(value: "$1.2M", alignment: .trailing), SheetCell(value: "$3.8M", alignment: .trailing), SheetCell(value: "$9.5M", alignment: .trailing), SheetCell(value: "$95M", alignment: .trailing)],
        [SheetCell(value: "Base Case", isBold: true), SheetCell(value: "$3.3M", isBold: true, alignment: .trailing, isHighlighted: true), SheetCell(value: "$11.4M", isBold: true, alignment: .trailing, isHighlighted: true), SheetCell(value: "$32M", isBold: true, alignment: .trailing, isHighlighted: true), SheetCell(value: "$320M", isBold: true, alignment: .trailing, isHighlighted: true)],
        [SheetCell(value: "Bull Case"), SheetCell(value: "$6.8M", alignment: .trailing), SheetCell(value: "$28M", alignment: .trailing), SheetCell(value: "$94M", alignment: .trailing), SheetCell(value: "$940M", alignment: .trailing)],
    ]
)
