import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCities } from '@/hooks/queries/use-get-cities';
import { useGetEvents } from '@/hooks/queries/use-get-events';
import { useGetUserEvents } from '@/hooks/queries/use-get-user-events';
import { cn } from '@/lib/utils';

export default function Events() {
  const { publicKey } = useWallet();
  const [parent] = useAutoAnimate();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cityId, setCityId] = useState('');
  const [name, setName] = useState('');
  const { data: cities, isLoading: isCitiesLoading } = useGetCities();
  const { data: events, isLoading: isEventsLoading } = useGetEvents(cityId, name);
  const { data: myEvents, isLoading: isMyEventsLoading } = useGetUserEvents(cityId, name);
  const redirectToEvent = useCallback(
    (event: Exclude<typeof events, undefined>[number]) => {
      navigate(`/events/${event.id}`);
    },
    [navigate]
  );
  const myEventsIds = useMemo(() => {
    return myEvents?.map((event) => event.id) ?? [];
  }, [myEvents]);

  return (
    <main className="container ">
      <div className="flex xl:ml-[268px] flex-col gap-12">
        <Tabs defaultValue="discover" className="w-full gap-4  flex items-center flex-col">
          <TabsList className="mx-auto">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger disabled={!publicKey} value="my-events">
              My events
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center w-full gap-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                  {cityId ? cities?.find((c) => cityId === c) : 'Select city...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                {isCitiesLoading ? (
                  <div className="flex items-center justify-between p-4">
                    <Loader2 className="animate-spin h-8 w-8" />
                  </div>
                ) : (
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No cities found.</CommandEmpty>
                      <CommandGroup>
                        {cities?.map((c) => (
                          <CommandItem
                            key={c}
                            value={c}
                            onSelect={(current) => {
                              setCityId(current === cityId ? '' : current);
                              setOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', cityId === c ? 'opacity-100' : 'opacity-0')} />
                            {c}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>
            <Input
              className="rounded-[16px] border-primary"
              placeholder="Search name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <TabsContent ref={parent} className="flex flex-col w-full gap-4" value="my-events">
              {isMyEventsLoading ? (
                <div className="flex items-center justify-between p-8">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              ) : myEventsIds.length > 0 ? (
                myEvents?.map((event) => <EventCard isMy={true} event={event} onClick={redirectToEvent} />)
              ) : (
                <div className="flex justify-center">
                  <p className="text-[16px] font-semibold">You have not participated in events yet</p>
                </div>
              )}
            </TabsContent>
            <TabsContent ref={parent} className="flex flex-col w-full gap-4" value="discover">
              {isEventsLoading ? (
                <div className="flex items-center justify-between p-8">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              ) : (
                events?.map((event) => (
                  <EventCard isMy={myEventsIds?.includes(event.id) ?? false} event={event} onClick={redirectToEvent} />
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
