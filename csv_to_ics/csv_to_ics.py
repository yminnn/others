import csv
from icalendar import Calendar, Event
from datetime import datetime, timedelta
import pytz
import re
import sys

def parse_time_components(time_str):
    """解析时间元素并返回结构化的时间数据"""
    pattern = r"""
        (\d{2}/\d{2}/\d{4})?  # 可选日期部分
        \s*
        (\d{1,2}:\d{2})       # 开始时间
        \s*
        \((GMT[+-]\d+)\)      # 时区
        \s*→\s*
        (\d{2}/\d{2}/\d{4})?  # 可选结束日期
        \s*
        (\d{1,2}:\d{2})       # 结束时间
    """
    match = re.search(pattern, time_str, re.VERBOSE)
    
    if not match:
        raise ValueError(f"Invalid time format: {time_str}")
        
    return {
        'start_time': match.group(2),
        'end_time': match.group(5),
        'timezone': match.group(3)
    }

def create_event_datetime(base_date, time_str, timezone):
    """创建带时区的datetime对象"""
    tz_offset = int(re.search(r"GMT([+-]\d+)", timezone).group(1))
    tz = pytz.FixedOffset(tz_offset * 60)
    
    event_time = datetime.strptime(time_str, "%H:%M").time()
    return tz.localize(datetime.combine(base_date, event_time))

def process_csv(input_file, output_file, target_date, timezone=None):
    """主处理函数"""
    # 解析目标日期
    base_date = datetime.strptime(target_date, "%Y-%m-%d").date()
    
    cal = Calendar()
    cal.add('prodid', '-//Smart Calendar Generator//')
    cal.add('version', '2.0')

    with open(input_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row['Task']:
                continue  # 跳过空任务

            try:
                # 解析时间组件
                time_data = parse_time_components(row['Date'])
                
                # 使用指定时区或自动检测时区
                event_tz = timezone if timezone else time_data['timezone']
                
                # 创建开始时间
                start_dt = create_event_datetime(base_date, 
                                                time_data['start_time'], 
                                                event_tz)
                
                # 创建结束时间
                end_dt = create_event_datetime(base_date,
                                              time_data['end_time'],
                                              event_tz)
                
                # 处理跨日事件
                if end_dt < start_dt:
                    end_dt += timedelta(days=1)

            except Exception as e:
                print(f"跳过事件 {row['Block']}: {str(e)}")
                continue

            # 创建日历事件
            event = Event()
            event.add('summary', row['Task'])
            event.add('dtstart', start_dt)
            event.add('dtend', end_dt)
            
            if row['Note'].strip():
                event.add('description', row['Note'])
            
            cal.add_component(event)

    # 写入ICS文件
    with open(output_file, 'wb') as f:
        f.write(cal.to_ical())

if __name__ == "__main__":
    # 命令行参数处理
    if len(sys.argv) < 3:
        print("使用方法:")
        print("  python script.py [输入文件.csv] [目标日期(YYYY-MM-DD)] [输出文件.ics] [时区]")
        print("示例:")
        print("  python script.py Timetable.csv 2024-05-20 MySchedule.ics GMT+3")
        sys.exit(1)

    input_csv = sys.argv[1]
    target_date = sys.argv[2]
    output_ics = sys.argv[3] if len(sys.argv) > 3 else f"Calendar_{target_date}.ics"
    timezone = sys.argv[4] if len(sys.argv) > 4 else None

    process_csv(input_csv, output_ics, target_date, timezone)
    print(f"成功生成日历文件: {output_ics}")