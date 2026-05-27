import { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Loading } from '@/shared/components/Loading';
import { EmptyState } from '@/shared/components/EmptyState';

import { memberService } from '@/gym/services/memberService';
import { attendanceService } from '@/gym/services/attendanceService';

const today = () => new Date().toISOString().slice(0, 10);

export default function Attendance() {
  const [date, setDate] = useState(today());
  const [members, setMembers] = useState([]);
  // Track present member ids as a Set<string> — simpler and avoids ObjectId/string mismatch bugs.
  const [presentIds, setPresentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async (d) => {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        memberService.list({ limit: 200, status: 'active' }),
        attendanceService.list({ date: d, limit: 200 }),
      ]);
      setMembers(mRes.data || []);
      const ids = new Set(
        (aRes.data || [])
          .filter((r) => r.status === 'present')
          .map((r) => String(r.member?._id || r.member))
          .filter(Boolean)
      );
      setPresentIds(ids);
    } catch (err) {
      // Surface the error so it doesn't fail silently.
      toast.error(err?.response?.data?.message || 'Could not load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date);
  }, [date]);

  const filtered = members.filter((m) =>
    !search ? true : m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  const mark = async (memberId) => {
    try {
      await attendanceService.mark({ memberId, status: 'present' });
      // Optimistic update — flip the UI immediately so it feels snappy.
      setPresentIds((prev) => {
        const next = new Set(prev);
        next.add(String(memberId));
        return next;
      });
      toast.success('Marked present');
      // Then re-pull from the server so what's on screen matches what's in the DB —
      // protects against the case where the record didn't actually persist.
      load(date);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Mark and review daily check-ins.</p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search member by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="sm:w-48" />
          </div>

          {loading ? (
            <Loading />
          ) : filtered.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="No active members" description="Add members first." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => {
                  const isPresent = presentIds.has(String(m._id));
                  return (
                    <TableRow key={m._id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.phone}</TableCell>
                      <TableCell>
                        {isPresent ? (
                          <Badge variant="success">Present</Badge>
                        ) : (
                          <Badge variant="secondary">Not marked</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" /> Already marked
                          </span>
                        ) : (
                          <Button size="sm" onClick={() => mark(m._id)} disabled={date !== today()}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Mark present
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
