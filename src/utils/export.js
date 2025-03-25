/**
 * 导出工具函数
 */
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

/**
 * 导出数据到Excel文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 文件名（不含扩展名）
 * @param {string} [sheetName='Sheet1'] - 工作表名称
 */
export function exportToExcel(data, fileName, sheetName = 'Sheet1') {
  try {
    if (!data || !data.length) {
      ElMessage.warning('没有可导出的数据');
      return;
    }

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    
    // 将数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // 生成Excel文件并下载
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出Excel失败:', error);
    ElMessage.error('导出失败');
  }
}

/**
 * 导出数据到CSV文件
 * @param {Array} data - 要导出的数据数组
 * @param {string} fileName - 文件名（不含扩展名）
 */
export function exportToCSV(data, fileName) {
  try {
    if (!data || !data.length) {
      ElMessage.warning('没有可导出的数据');
      return;
    }

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    
    // 将数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 生成CSV文件并下载
    XLSX.writeFile(workbook, `${fileName}.csv`);
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出CSV失败:', error);
    ElMessage.error('导出失败');
  }
}

/**
 * 导出HTML表格到Excel
 * @param {HTMLElement} table - HTML表格元素
 * @param {string} fileName - 文件名（不含扩展名）
 */
export function exportTableToExcel(table, fileName) {
  try {
    if (!table) {
      ElMessage.warning('没有可导出的表格');
      return;
    }

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    
    // 将表格转换为工作表
    const worksheet = XLSX.utils.table_to_sheet(table);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // 生成Excel文件并下载
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出表格失败:', error);
    ElMessage.error('导出失败');
  }
}
